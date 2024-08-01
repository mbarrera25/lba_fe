import { Component, OnInit } from '@angular/core';
import { cryptoDashboard } from 'src/app/shared/data/crypto-dash';
import { OwlOptions } from 'ngx-owl-carousel-o';
import * as chartData from '../../../shared/data/crypto-dash';
import { AnalysisService } from '../analysis.service';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { AnalysisFormComponent } from './analysis-form/analysis-form.component';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { iAnalysis } from 'src/app/models/Analysis.model';

@Component({
  selector: 'app-crypto-dashboard',
  templateUrl: './crypto-dashboard.component.html',
  styleUrls: ['./crypto-dashboard.component.scss'],
})
export class CryptoDashboardComponent implements OnInit {
  cryptoDashdata = cryptoDashboard;
  customOptions: OwlOptions;

  constructor(
    public analysisService: AnalysisService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.analysisService.getallAnalysis()

  }

  delete(analysis: any) {
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
        this.analysisService.deleteAnalysis(analysis).pipe(
          tap(t => {
            Swal.fire({
              title: 'Eliminado!',
              text: 'El Analisis se ha eliminado',
              icon: 'success',
              confirmButtonColor: '#6259ca'
            });
            this.analysisService.getallAnalysis();
          })
        ).subscribe()

      }
    })
  }
  openForm(analysis: iAnalysis) {
    const modalRef= this.modalService.open(AnalysisFormComponent);
    modalRef.componentInstance.analysis = analysis
  }
}
