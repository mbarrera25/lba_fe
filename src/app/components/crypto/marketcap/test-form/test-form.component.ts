import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription } from 'rxjs';
import { iTest, iTestDetail, Test } from 'src/app/models/Test.model';
import { Pagination } from 'src/app/models/utils';
import { AnalysisService } from '../../analysis.service';
import { ToastService } from 'src/app/components/elements/toast/toast.service';
import Swal from 'sweetalert2';
import { PropertyTestComponent } from './property-test/property-test.component';

@Component({
  selector: 'app-test-form',
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.scss'],
})
export class TestFormComponent implements OnInit {


  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  @Input() test: iTest
  listdetailTest$ = new BehaviorSubject<iTestDetail[]>([]);

  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private analisysService: AnalysisService,
    config: NgbModalConfig,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    public toastService: ToastService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {


    this.firstFormGroup = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
    });
    this.secondFormGroup = this.fb.group({
      name: ['', [Validators.required]],
      list_value: [''],
      indicator: [''],
    });

    if ( this.test != null ) {
      this.fillForm()
    }
  }
  fillForm() {
    console.log(this.test);

    this.firstFormGroup.patchValue({
      code: this.test.code,
      name: this.test.name,
      description: this.test.description,
      price: this.test.price,
    })
     const list = this.test.TestDetails.map( t => { return {id: t.id, name: t.name, list_value: t.list_value, indicator: t.indicator}})
     this.listdetailTest$.next(list)
  }

  addProperty() {
    const { name, list_value, indicator } = this.secondFormGroup.value;
    const list = this.listDetail;
    list.push({
      id: null,
      name: name,
      list_value: list_value,
      indicator: indicator,
    });
    this.listdetailTest$.next(list);
    this.limpiarForm
  }

  get limpiarForm(){
    return this.secondFormGroup.patchValue({
      name: "",
      list_value: "",
      indicator: "",
    })
  }

  get listDetail() {
    return this.listdetailTest$.value;
  }
  finish() {
    throw new Error('Method not implemented.');
  }

  deleteProp(det: iTestDetail) {
    let list = this.listDetail;
    list = list.filter((d) => d.name != det.name);
    this.listdetailTest$.next(list);
    if (det.id != null){
      this.analisysService.deleteDetail(det.id).subscribe()
    }
  }

  save() {
    const { code, name, description, price } = this.firstFormGroup.value;
    const test = new Test(code, name, description, price, this.listDetail);
    if (this.test != null){
      test.id = this.test.id
      return this.analisysService.update(test).subscribe(() => this.action("Actualizado"))
    }


    this.analisysService.saveTest(test).subscribe(() => this.action());
  }
  action(accion: string = null) {
    this.activeModal.close();
      Swal.fire(`${accion != null ? accion : 'Creado'} con exito!`)
      this.analisysService.getallTest();
  }

  see(det: any){
    const modalRef= this.modalService.open(PropertyTestComponent,{ size: 'lg'})
    modalRef.componentInstance.det = det
  }
  cancelar() {
    this.activeModal.close();
  }

}
