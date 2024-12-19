import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-form-searcher-patient',
  templateUrl: './form-searcher-patient.component.html',
  styleUrls: ['./form-searcher-patient.component.scss']
})
export class FormSearcherPatientComponent implements OnInit {

  constructor(
        public activeModal: NgbActiveModal,

  ) { }

  ngOnInit(): void {
  }

  save() {
    throw new Error('Method not implemented.');
    }
    closeModal() {
      this.activeModal.dismiss();
    }


}
