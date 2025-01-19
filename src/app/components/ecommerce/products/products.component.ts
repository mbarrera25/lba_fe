import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators';
import { PacienteService } from '../ecommerce-dashboard/paciente.service';
import { iPaciente } from 'src/app/models/paciente.model';
import { NgbAccordionConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Subscription } from 'rxjs';
import { AnalysisService } from '../../crypto/analysis.service';
import { LoadTestsComponent } from './load-tests/load-tests.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  formRecord: FormGroup;
  selectedAnalisis: any;
  private pacienteSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    public pacienteService: PacienteService,
    private accordionConfig: NgbAccordionConfig,
    private analysisService: AnalysisService,
    private modalService: NgbModal
  ) {
    this.accordionConfig.closeOthers = true;
  }
  ngOnDestroy(): void {
    //clear all subscriptions
    this.pacienteService.pacientRecord$.next(null);
    this.pacienteService.pacientListRecord$.next([]);
    this.pacienteSubscription.unsubscribe();

    console.log('ProductsComponent destroyed');
  }

  ngOnInit(): void {
    this.formRecord = this.fb.group({
      paciente: [],
    });
    this.pacienteSubscription = this.formRecord
      .get('paciente')
      .valueChanges.pipe(
        debounceTime(1000), // Espera 1 segundo después de que el usuario deja de escribir
        filter((value) => !!value && value.trim() !== ''), // Solo continúa si hay un valor no vacío
        switchMap((value) => this.pacienteService.searchPatient(value)) // Cambia a la nueva búsqueda
      )
      .subscribe((results: iPaciente[]) => {
        this.pacienteService.pacientListRecord$.next(results); // Actualiza los resultados
      });
  }
  onSelectPaciente(event: any) {
    this.formRecord.get('paciente')?.setValue(event); // Actualiza el valor del formulario
    this.pacienteService
      .getPatientRecord(event.id)
      .pipe(
        tap((p) => {
          this.pacienteService.pacientRecord$.next(p);
          console.log(p.analysis);
          console.log(p);
        })
      )
      .subscribe();
    // Limpia los resultados
    this.pacienteService.pacientListRecord$.next([]); // Limpia los resultados
  }
  loadTest(id_request: any) {
    console.log('Cargando examen');
    console.log(id_request);
    const modalRef = this.modalService.open(LoadTestsComponent, {
      size: 'xl',
      windowClass: 'custom-modal-size',
    });
    modalRef.componentInstance.idRequest = id_request;

    modalRef.result.then(() => {});
  }

  enviarCorreo(analisis: any) {}

  imprimir(analisis: any): void {
    console.log(analisis);
  }

  calcularEdad(fechaNacimiento: string): number {
    const birthDate = new Date(fechaNacimiento);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }
}
