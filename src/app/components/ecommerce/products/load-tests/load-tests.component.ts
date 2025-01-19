import { TestDetail } from './../../../../models/Test.model';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SolicitudService } from 'src/app/components/widgets/solicitud.service';
import { ResultPatient } from 'src/app/models/ResultPatient.model';

@Component({
  selector: 'app-load-tests',
  templateUrl: './load-tests.component.html',
  styleUrls: ['./load-tests.component.scss'],
})
export class LoadTestsComponent implements OnInit {
  @Input() idRequest: any;
  analysisForm: FormGroup;
  analyses = new BehaviorSubject<any[]>([]);
  selectedAnalysis = new BehaviorSubject<any>(null);
  constructor(
    private solicitudService: SolicitudService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.solicitudService
      .getAnalysisBySolicitud(this.idRequest)
      .pipe(
        tap((resp) => {
          this.analyses.next(resp);
          console.log(resp);
        })
      )
      .subscribe();
    console.log(this.analyses);
  }

  toggleDetails(analysis: any) {
    this.selectedAnalysis.next(analysis);
  }

  saveTest() {
    let listAnalisis = this.analyses.value.filter(
      (a) => a.id !== this.selectedAnalysis.value.id
    );
    //const analisisLoaded = listAnalisis
    listAnalisis.push(this.selectedAnalysis.value);
    this.analyses.next(listAnalisis);
    this.selectedAnalysis.next(null);
    console.log(this.analyses.value);
  }
  saveResults() {
    const resul = this.analyses.value.flatMap((a) => 
      a.Tests.flatMap((t: any) => 
        t.TestDetails.map((td: any) => 
          new ResultPatient(td.result_value, a.id, td.id)
        )
      )
    );
    this.solicitudService.loadResults(resul).pipe(
      tap(r => {
        if(r != null){
         this.solicitudService.changeStatus('cargado',this.idRequest).subscribe()
          }
        }
       )
    ).subscribe();

    console.log(resul);
    
  }
}
