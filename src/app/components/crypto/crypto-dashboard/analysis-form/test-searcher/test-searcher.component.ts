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

  ngOnInit(): void {
  }
  search() {
    const value: String = this.value.value;
    console.log('Searching for:', value);
    this.analysisService
      .searchTest(value)
      .pipe(tap((r) => this.listSeleccionables$.next(r)))
      .subscribe();
  }

  selected(test: iTest){
    if(this.getisAlReadySelected(test.code) != null){
      return Swal.fire('Este Examen ya fue elegido')
    }
    const list = this.listTest
    list.push(test)
    this.analysisService.listSeletedTest$.next(list)
    this.activeModal.close();
  }
  cancelar() {
    this.activeModal.close();

  }

  getisAlReadySelected(code: string){
    const list= this.listTest
    return list.find( t=> t.code === code)
  }
  get listTest(){
    return this.analysisService.listSeletedTest$.value
  }
  get cleanList(){
    return this.listSeleccionables$.next([])
  }
}
