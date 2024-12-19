import { Component, Input, OnInit } from '@angular/core';
import { SolicitudService } from '../../solicitud.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { iRequest } from 'src/app/models/solicitudes.model';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddIgtfComponent } from './add-igtf/add-igtf.component';
import { Invoice, InvoiceDetail } from 'src/app/models/Invoice.model';
import { tap } from 'rxjs/operators';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as pdfMake from 'pdfmake/build/pdfmake';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  INVOICE_TYPE = 'Facturas'
  bookTypeId = null
  form: FormGroup;
  @Input() data: iRequest;
  showSelectTalonario = true
  changePatient = false
  conditionList = [
    {
      name: 'Contado',
      value: 'contado'
    },
    {
      name: 'Credito',
      value: 'credito'
    }
  ]

  typePersonList = [
    {
      name: 'V',
      value: 'V'
    },
    {
      name: 'J',
      value: 'J'
    },
    {
      name: 'P',
      value: 'P'
    },
    {
      name: 'G',
      value: 'G'
    },
    {
      name: 'E',
      value: 'E'
    },
  ]

  constructor(
    public solicitudService: SolicitudService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,


  ) { }

  ngOnInit(): void {
    console.log(this.data);

    this.solicitudService.getBookPaymenByType(this.INVOICE_TYPE)
    this.solicitudService.getAllPaymentMethod()

    this.form = this.fb.group({
      condition: [, Validators.required],
      payment_method: [, Validators.required],
      book_payment: [, Validators.required],
      client: [''],
      identification: [''],
      address: [''],
      invoice_number: [],
      type_person: ['V']
    });
    console.log(this.solicitudService.rate$.value);
  }
  get invoiceDate() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0'); // Asegura que el día tenga dos dígitos
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Suma 1 al mes y asegura dos dígitos
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  get rateToday() {
    return this.solicitudService.rate$.value.rate
  }

  onSelectTlonario(event: any) {
    console.log(event);
    const number = `${event.serie}-${event.nro_current}`
    this.solicitudService.invoiceNumber$.next(number)
    this.showSelectTalonario = false
    this.bookTypeId = event.id

  }

  showPatientEdit() {
    this.changePatient = true
    this.updatePatientValidators()
  }

  openModalIgtf() {
    const modalRef = this.modalService.open(AddIgtfComponent, {
      size: 'sm',
      windowClass: 'custom-modal-height custom-modal-size'
    });
    //modalRef.componentInstance.data = solicitud;

    modalRef.result.then(() => {

    });
  }

  updatePatientValidators(): void {
    if (this.changePatient) {
      // Hacer obligatorios los campos de cliente solo si changePatient es true
      this.form.get('client')?.setValidators(Validators.required);
      this.form.get('identification')?.setValidators(Validators.required);
      this.form.get('address')?.setValidators(Validators.required);
      this.form.get('type_person')?.setValidators(Validators.required);
    }

    // Actualizar el estado de validación de los controles
    this.form.get('client')?.updateValueAndValidity();
    this.form.get('identification')?.updateValueAndValidity();
    this.form.get('address')?.updateValueAndValidity();
    this.form.get('type_person')?.updateValueAndValidity();

  }

  getTypePerson(id: string){
    return id.charAt(0);
  }

  get summary(){
    return this.solicitudService.summary$.value
  }

  get rate(){
    return this.solicitudService.rate$.value
  }
  processInvoice(){
    if (!this.form.valid){
      this.form.markAllAsTouched()
    }
    console.log(this.form.value);

    const lines = this.data.analysis.map( det => new InvoiceDetail(1,det.name,det.price,det.price,this.rate.rate))

     const invoice = new Invoice(
       this.changePatient ? this.form.value.client : this.data.patient.full_name,
       this.changePatient ? this.form.value.identification : this.data.patient.identification,
       this.changePatient ? this.form.value.type_person : this.getTypePerson(this.data.patient.identification),
       this.changePatient ? this.form.value.address : this.data.patient.address,
       this.solicitudService.invoiceNumber$.value,
       this.summary.total_Bs,
       this.summary.subtotal_bs,
       this.summary.igtf_bs,
       this.solicitudService.rate$.value.rate,
       lines,
       'VES'
     )

     this.solicitudService.createdInvoice(invoice).pipe(
        tap( f => {
          this.solicitudService.incrementBookPayment(this.bookTypeId)
          this.solicitudService.invoiceNumber$.next(null)
          this.activeModal.close()
        })
     ).subscribe()

     console.log(invoice);


  }

  ImprimirFact(factura: Invoice) {
    const moneda = 'Bs. ';
    const fecha: Date = factura.date_at;
    const detalles = factura.invoice_line.map((det) => {
      return [
        { text: det.quantity },
        { text: det.description },
        { text: moneda + det.price },
        { text: moneda + det.total },
      ];
    });
    const pdfDefinition: TDocumentDefinitions = {
      content: [
        {
          alignment: 'justify',
          marginBottom: 20,
          // marginLeft: 50,
          columns: [
            {
              table: {
                headerRows: 1,
                widths: ['auto', 100],
                body: [
                  [
                    {
                      border: [true, true, false, false],
                      bold: true,
                      text: 'Cliente:',
                    },
                    {
                      border: [false, true, true, false],
                      text: factura.name,
                      style: { alignment: 'right' },
                    },
                  ],
                  [
                    {
                      border: [true, false, false, false],
                      bold: true,
                      text: 'Rif/Cedula:',
                    },
                    {
                      border: [false, false, true, false],
                      text: factura.identification,
                      style: { alignment: 'right' },
                    },
                  ],
                  [
                    {
                      border: [true, false, false, false],
                      bold: true,
                      text: 'Direccion:',
                    },
                    {
                      border: [false, false, true, false],
                      text: factura.direction,
                      style: { alignment: 'right' },
                    },
                  ],
                  /*[
                    {
                      border: [true, false, false, true],
                      bold: true,
                      text: 'Telefono:',
                    },
                    {
                      border: [false, false, true, true],
                      text: factura.persona.telefono,
                      style: { alignment: 'right' },
                    },
                  ],*/
                ],
              },
            },
            {
              table: {
                headerRows: 1,
                widths: ['auto', 100],
                body: [
                  [
                    {
                      border: [true, true, false, false],
                      bold: true,
                      text: 'Factura N°:',
                    },
                    {
                      border: [false, true, true, false],
                      text: factura.invoice_number,
                      style: { alignment: 'right' },
                    },
                  ],
                  [
                    {
                      border: [true, false, false, false],
                      bold: true,
                      text: 'Fecha:',
                    },
                    {
                      border: [false, false, true, false],
                      text:
                        fecha.getDate() +
                        '/' +
                        (fecha.getMonth() + 1) +
                        '/' +
                        fecha.getFullYear(),
                      style: { alignment: 'right' },
                    },
                  ],
                  [
                    {
                      border: [true, false, false, false],
                      bold: true,
                      text: 'Condicion:',
                    },
                    {
                      border: [false, false, true, false],
                      text: "-",
                      style: { alignment: 'right' },
                    },
                  ],
                  [
                    {
                      border: [true, false, false, true],
                      bold: true,
                      text: 'Metodo de Pago:',
                    },
                    {
                      border: [false, false, true, true],
                      text: "",
                      style: { alignment: 'right' },
                    },
                  ],
                ],
              },
            },
          ],
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 300, 65, 65],
            body: [
              [
                { text: 'Cant', style: 'tableHeader' },
                { text: 'Descripcion', style: 'tableHeader' },
                { text: 'Precio', style: 'tableHeader' },
                { text: 'Total', style: 'tableHeader' },
              ],
              detalles,
            ],
          },
        },
        {
          style: 'totalesTable',
          table: {
            widths: ['auto', 'auto'],
            body: [
              [
                { text: 'Sub-Total:' },
                {
                  text: moneda + factura.subtotal_amount,
                  style: { alignment: 'right' },
                },
              ],
              [
                { text: 'Total Exento:' },
                {
                  text: moneda + factura.total_amount,
                  style: { alignment: 'right' },
                },
              ],
              [
                { text: 'IGTF:' },
                {
                  text: factura.igtf
                    ? moneda + factura.igtf
                    : moneda + '0.00',
                  style: { alignment: 'right' },
                },
              ],
              [
                { text: 'Total a Pagar:' },
                {
                  text: moneda + factura.total_amount,
                  style: { alignment: 'right' },
                },
              ],
            ],
          },
          layout: 'noBorders',
        },
      ],
      styles: {
        totalesTable: {
          marginTop: 10,
          marginLeft: 345,
          marginBottom: 10,
        },
      },
    };
    var win = window.open('', '_blank');
    return pdfMake
      .createPdf(pdfDefinition, {}, undefined, pdfFonts.pdfMake.vfs)
      .download();
  }

}
