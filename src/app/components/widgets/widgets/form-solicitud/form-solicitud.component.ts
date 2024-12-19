import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormSearcherPatientComponent } from './form-searcher-patient/form-searcher-patient.component';
import { SolicitudService } from '../../solicitud.service';
import { debounceTime, filter, switchMap } from 'rxjs/operators';
import { iPaciente } from 'src/app/models/paciente.model';
import { iAnalysis } from 'src/app/models/Analysis.model';
import { RequestReq } from 'src/app/models/solicitudes.model';

@Component({
  selector: 'app-form-solicitud',
  templateUrl: './form-solicitud.component.html',
  styleUrls: ['./form-solicitud.component.scss'],
})
export class FormSolicitudComponent implements OnInit {
  formSoli: FormGroup;
  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    public solicitudService: SolicitudService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formSoli = this.fb.group({
      paciente: [,Validators.required],
      analisis: [],
      observation: [],
    });

   // Configuración para el campo de búsqueda de pacientes
this.formSoli.get('paciente').valueChanges.pipe(
  debounceTime(1000), // Espera 1 segundo después de que el usuario deja de escribir
  filter(value => !!value && value.trim() !== ''), // Solo continúa si hay un valor no vacío
  switchMap((value) => this.solicitudService.searchPatient(value)) // Cambia a la nueva búsqueda
)
.subscribe((results: iPaciente[]) => {
  this.solicitudService.patients$.next(results); // Actualiza los resultados
});


    // Configuración para el campo de búsqueda de análisis
    this.formSoli.get('analisis').valueChanges.pipe(
      debounceTime(1000), // Espera 1 segundo después de que el usuario deja de escribir
      switchMap((value) => this.solicitudService.searchAnalysis(value)) // Cambia a la nueva búsqueda
    )
    .subscribe((results: any[]) => { // Aquí asegúrate de que `results` tenga el tipo correcto
      results = results.map((result) => ({...result, label: result.code + " " + result.name})); // Mapea los resultados
      this.solicitudService.listSeleccionableAnalisis$.next(results); // Actualiza los resultados
    });
  }


  save() {
    console.log(this.formSoli.get('paciente').value);
    console.log( this.solicitudService.listAnalisis$.value);
    if ( this.formSoli.get('paciente').value && this.solicitudService.listAnalisis$.value.length > 0){
      let req = new RequestReq(this.formSoli.get('paciente').value,this.solicitudService.listAnalisis$.value,this.formSoli.get('observation').value )
      console.log(req);

      this.solicitudService.saveSolicitud(req).subscribe(() => {
        this.solicitudService.getAllSolicitudes();
        this.solicitudService.listAnalisis$.next(null)
        this.activeModal.close();
      });

    }

  }
  closeModal() {
    this.activeModal.dismiss();
  }

  open() {
    const modalRef = this.modalService.open(FormSearcherPatientComponent, {
      size: 'lg',
      windowClass: 'custom-modal-size',
    });
    modalRef.result.then(() => {});
  }

  onSelectPaciente(event: any) {
    console.log(event);

    this.formSoli.get('paciente')?.setValue(event); // Actualiza el valor del formulario
    this.solicitudService.patients$.next([]); // Limpia los resultados
  }

  onAnalisisSelected(analisis: any) {
    // Limpia el campo de búsqueda
    this.formSoli.get('analisis').setValue(null);

    const lst = this.solicitudService.listAnalisis$.value;

    // Verifica si el análisis ya está en la lista
    const exists = lst.some((a: any) => a.id === analisis.id);

    // Si no existe, agregarlo a la lista
    if (!exists) {
      lst.push(analisis);
      this.solicitudService.listAnalisis$.next(lst); // Actualiza la lista
    } else {
      console.log('El análisis ya está en la lista.');
    }
  }


  deleteAnalisis(analisi: iAnalysis) {
    this.solicitudService.listAnalisis$.next(
      this.solicitudService.listAnalisis$.value.filter(
        (analisis) => analisi.id !== analisis.id
      )
    ); // Elimina el análisis de la lista
  }
}
