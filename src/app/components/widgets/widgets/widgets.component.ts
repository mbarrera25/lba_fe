import { Component, OnInit } from '@angular/core';
import { SolicitudService } from '../solicitud.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormSolicitudComponent } from './form-solicitud/form-solicitud.component';
import { iRequest } from 'src/app/models/solicitudes.model';
import { InvoiceComponent } from './invoice/invoice.component';
import { Summary } from 'src/app/models/Summary.model';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss'],
})
export class WidgetsComponent implements OnInit {
  INVOICED = 'facturado';

  constructor(
    public solicitudService: SolicitudService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.solicitudService.getAllSolicitudes();
    this.solicitudService.getRateNow();
  }

  openFromsSolicitud() {
    const modalRef = this.modalService.open(FormSolicitudComponent, {
      size: 'xl',
      windowClass: 'custom-modal-size',
    });
    modalRef.result.then(() => {});
    // modalRef.componentInstance.paciente = paciente
  }

  facturar(solicitud: iRequest) {
    this.solicitudService.summary$.next(
      new Summary(
        this.solicitudService.rate$.value.rate,
        0,
        solicitud.sub_total
      )
    );
    console.log(this.solicitudService.summary$.value);

    const modalRef = this.modalService.open(InvoiceComponent, {
      size: 'lg',
      windowClass: 'custom-modal-size',
    });
    modalRef.componentInstance.data = solicitud;

    modalRef.result.then(() => {
      this.solicitudService
        .changeStatus(this.INVOICED, solicitud.id)
        .pipe(
          tap((t) => {
            this.solicitudService.getAllSolicitudes();
          })
        )
        .subscribe();
    });
  }
}
