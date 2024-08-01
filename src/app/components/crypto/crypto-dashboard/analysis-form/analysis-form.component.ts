import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AnalysisService } from '../../analysis.service';
import { iTest } from 'src/app/models/Test.model';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { TestSearcherComponent } from './test-searcher/test-searcher.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Analysis } from 'src/app/models/Analysis.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-analysis-form',
  templateUrl: './analysis-form.component.html',
  styleUrls: ['./analysis-form.component.scss'],
})
export class AnalysisFormComponent implements OnInit {
  @Input() analysis: Analysis | null = null;
  value = new FormControl('');
  analysisForm: FormGroup;
  listSeleccionables$ = new BehaviorSubject<iTest[] | null>(null);

  constructor(
    private fb: FormBuilder,
    public analysisService: AnalysisService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.analysisForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
    });
    if (this.analysis != null) {
      this.fillForm();
    }
  }

  fillForm() {
    this.analysisForm.patchValue({
      code: this.analysis.code,
      name: this.analysis.name,
      description: this.analysis.description,
      price: this.analysis.price,
    });
    this.analysisService.listSeletedTest$.next(this.analysis.Tests);
    console.log(this.analysisService.listSeletedTest$.value)
  }

  cancelar() {
    this.activeModal.close()
  }

  see(test: iTest) {}

  deleteTest(test: iTest) {
    let l = this.listselect;
    l = l.filter((lt) => lt.code != test.code);
    this.analysisService.listSeletedTest$.next(l);
    if ( this.analysis != null){
      this.analysisService.deleteAnalysisTest(test.id).subscribe()
    }
  }
  get listselect() {
    return this.analysisService.listSeletedTest$.value;
  }

  save() {

    const { code, name, description, price } = this.analysisForm.value;
    const analysis = new Analysis(
      code,
      name,
      description,
      price,
      this.analysisService.listSeletedTest$.value
    );
    if (this.analysis != null){

    }
    this.analysisService.saveAnalysis(analysis).subscribe((res: any) => {
      if (res.status == 201) {
        Swal.fire('El analisys fue guardado con exito!');
        this.analysisService.getallAnalysis();
        this.cleanList();
        this.activeModal.close();
      }
    });

  }

  open() {
    this.modalService.open(TestSearcherComponent);
  }

  cleanList() {
    this.analysisService.listSeletedTest$.next([]);
    this.listSeleccionables$.next([]);
  }
}
