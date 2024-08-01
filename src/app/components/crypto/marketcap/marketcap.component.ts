import { Component, OnInit } from '@angular/core';
import { cryptoMarketData } from 'src/app/shared/data/crypto-market';
import { AnalysisService } from '../analysis.service';
import { BehaviorSubject } from 'rxjs';
import { iTest } from 'src/app/models/Test.model';
import { Pagination } from 'src/app/models/utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TestFormComponent } from './test-form/test-form.component';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-marketcap',
  templateUrl: './marketcap.component.html',
  styleUrls: ['./marketcap.component.scss'],
})
export class MarketcapComponent implements OnInit {
  pagination$ = new BehaviorSubject<Pagination | null>(null);
  paginat: Pagination | null = null

  public cryptoMarketData = cryptoMarketData;

  constructor(
    public serviceAnalysis: AnalysisService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.serviceAnalysis.getallTest()
  }
  getTotalPaginas(totalItems, pageSize) {
    return Math.ceil(totalItems / pageSize);
  }


  get paginas(){
    return this.generateNumberRange(this.getTotalPaginas(this.pagination$.value.total, this.pagination$.value.size))
  }

  generateNumberRange(end: number): number[] {
    const numbers: number[] = [];

    for (let i = 1; i <= end; i += 1) {
      numbers.push(i);
    }

    return numbers;
  }

  openForm(test: iTest){
    const modalRef= this.modalService.open(TestFormComponent,{ size: 'xl'})
    modalRef.componentInstance.test = test
  }

  delete(test: iTest){
    Swal.fire({
      icon: 'warning',
      title: 'Eliminar...',
      text: 'Seguro que quieres eliminar este Test?',
      showCancelButton: true,
      confirmButtonColor: '#6259ca',
      cancelButtonColor: '#6259ca',
      confirmButtonText: 'Si',
      reverseButtons: true

    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.serviceAnalysis.deleteTest(test).pipe(
          tap( t => {
            Swal.fire({
              title: 'Eliminado!',
              text: 'El Test se ha eliminado',
              icon: 'success',
              confirmButtonColor: '#6259ca'
            })
            this.serviceAnalysis.getallTest()
          })
        ).subscribe()

      }
    })
  }

}
