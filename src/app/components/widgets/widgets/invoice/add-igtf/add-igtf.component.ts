import { Component, OnInit } from '@angular/core';
import { SolicitudService } from '../../../solicitud.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Summary } from 'src/app/models/Summary.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-igtf',
  templateUrl: './add-igtf.component.html',
  styleUrls: ['./add-igtf.component.scss']
})
export class AddIgtfComponent implements OnInit {
  form: FormGroup;

  constructor(
    public solicitudService: SolicitudService,
    private fb: FormBuilder,
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      igtf_usd: []
    });
  }

  saveForeignAmount(){
    console.log(this.form.value);
    const summary = new Summary(this.solicitudService.rate$.value.rate,this.form.value.igtf_usd,this.solicitudService.summary$.value.subTotal_usd)
    this.solicitudService.summary$.next(summary)
    this.activeModal.close('Closed with a result')
  }

}
