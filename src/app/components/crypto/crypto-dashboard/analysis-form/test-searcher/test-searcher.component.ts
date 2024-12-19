import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { iTest } from 'src/app/models/Test.model';
import { AnalysisService } from '../../../analysis.service';
import { FormControl } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-test-searcher',
  templateUrl: './test-searcher.component.html',
  styleUrls: ['./test-searcher.component.scss']
})
export class TestSearcherComponent implements OnInit {

  listSeleccionables$ = new BehaviorSubject<iTest[]>([]);
  value = new FormControl('');

  constructor(
    public analysisService: AnalysisService,
    private activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void { }

  // Método para realizar la búsqueda de los exámenes
  search() {
    const value: string = this.value.value;
    console.log('Searching for:', value);
    this.analysisService
      .searchTest(value)
      .pipe(tap((r) => this.listSeleccionables$.next(r)))
      .subscribe();
  }

  // Método para manejar la selección de exámenes
  toggleSelection(test: iTest) {

    if (test.selected) {
      // Si está marcado, agregarlo a la lista
      if (this.getisAlReadySelected(test.code) == null) {
        this.listTest.push(test);
        this.analysisService.listSeletedTest$.next(this.listTest);
      }
    } else {
      // Si está desmarcado, eliminarlo de la lista
      this.analysisService.listSeletedTest$.next(this.listTest.filter(t => t.code !== test.code));
    }
  }

  // Método para agregar los exámenes seleccionados y cerrar el modal
  addTestsAndClose() {
    // Filtrar los exámenes seleccionados
    const selectedTests = this.listTest.filter(test => test.selected);

    // Actualizar la lista de seleccionados en el servicio
    this.analysisService.listSeletedTest$.next(selectedTests);

    // Cerrar el modal
    this.activeModal.close();
  }

  // Método para cerrar el modal sin hacer nada
  cancelar() {
    this.activeModal.close();
  }

  // Verificar si un examen ya ha sido seleccionado
  getisAlReadySelected(code: string) {
    return this.listTest.find(t => t.code === code);
  }

  // Lista de los exámenes seleccionados en el servicio
  get listTest() {
    return this.analysisService.listSeletedTest$.value;
  }
}
