import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { iTestDetail } from 'src/app/models/Test.model';

@Component({
  selector: 'app-property-test',
  templateUrl: './property-test.component.html',
  styleUrls: ['./property-test.component.scss']
})
export class PropertyTestComponent implements OnInit {

@Input() det: iTestDetail
  constructor(
    private activeModal: NgbActiveModal,

  ) { }

  ngOnInit(): void {
  }
cancelar() {
  this.activeModal.close();

}
}
