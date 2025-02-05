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
  calculatedPrice: number = 0;  // Esta es la propiedad para almacenar el precio calculado

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
      price: [0, Validators.required],
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
    console.log(this.analysisService.listSeletedTest$.value);
  }

  cancelar() {
    this.activeModal.close();
  }

  see(test: iTest) {}

  deleteTest(test: iTest) {
    let l = this.listselect;
    l = l.filter((lt) => lt.code != test.code);
    this.analysisService.listSeletedTest$.next(l);
    if (this.analysis != null) {
      this.analysisService.deleteAnalysisTest(test.id).subscribe();
    }
    this.recalculate()
  }
  get listselect() {
    return this.analysisService.listSeletedTest$.value;
  }

  save() {
    if (this.analysisForm.valid && this.analysisForm.value.price > 0) {
      const { code, name, description, price } = this.analysisForm.value;
      const analysis = new Analysis(
        code,
        name,
        description,
        price,
        this.analysisService.listSeletedTest$.value
      );
      if (this.analysis != null) {
        analysis.id = this.analysis.id;
        this.analysisService.updateAnalysis(analysis).subscribe((res: any) => {
          if (res.status == 200) {
            Swal.fire('El analisis fue actualizado con exito!');
            this.analysisService.getallAnalysis();
            this.cleanList();
            this.activeModal.close();
          }
        });
        return;
      }
      this.analysisService.saveAnalysis(analysis).subscribe((res: any) => {
        if (res) {
          Swal.fire('El analisis fue guardado con exito!');
          this.analysisService.getallAnalysis();
          this.cleanList();
          this.activeModal.close();
        }
      });
    }
  }
  open() {
    const modalRef = this.modalService.open(TestSearcherComponent);

    // Suscribirse al evento de cierre del modal
    modalRef.result.then(
      (result) => {
        // Aquí puedes ejecutar el método calculate cuando el modal se cierra
        this.recalculate();
      },
      (reason) => {
        // Aquí puedes manejar cualquier cancelación o error, si es necesario
        this.recalculate(); // Ejecutar el cálculo también si el modal se cierra de alguna forma
      }
    );
  }


  cleanList() {
    this.analysisService.listSeletedTest$.next([]);
    this.listSeleccionables$.next([]);
  }

   // Método para recalcular el precio
   recalculate() {
    const selectedTests = this.analysisService.listSeletedTest$.value;
    this.updateCalculatedPrice(selectedTests);
  }

  // Método para actualizar el precio calculado
  private updateCalculatedPrice(selectedTests: any[]) {
    this.calculatedPrice = selectedTests.reduce(
      (total, test) => total + test.price,
      0
    );
    // Actualiza el valor en el formulario
    this.analysisForm.patchValue({ price: this.calculatedPrice });
  }
}
