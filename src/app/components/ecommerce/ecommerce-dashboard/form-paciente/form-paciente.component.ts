import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PacienteService } from '../paciente.service';
import { iPaciente } from 'src/app/models/paciente.model';

@Component({
  selector: 'app-form-paciente',
  templateUrl: './form-paciente.component.html',
  styleUrls: ['./form-paciente.component.scss'],
})
export class FormPacienteComponent implements OnInit {
  @Input() paciente: iPaciente | null = null;
  formPaciente: FormGroup;
  tipoDeSangre = [
    { label: 'O+', value: 'O+' },
    { label: 'O-', value: 'O-' },
    { label: 'A+', value: 'A+' },
    { label: 'A-', value: 'A-' },
    { label: 'B+', value: 'B+' },
    { label: 'B-', value: 'B-' },
    { label: 'AB+', value: 'AB+' },
    { label: 'AB-', value: 'AB-' },
  ];
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private pacienteService: PacienteService
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.paciente != null) {
      this.patchPaciente(this.paciente);
    }
    this.formPaciente.valueChanges.subscribe((value) => {
      console.log(value);
      this.pacienteService.paciente.next(value);
    });
  }
  patchPaciente(paciente: iPaciente) {
    this.formPaciente.patchValue({
      date_birth: this.getDate(paciente.date_birth),
      ...paciente,
    });
    this.pacienteService.paciente.next(paciente);
  }
  initForm() {
    this.formPaciente = this.fb.group({
      identification: [, Validators.required],
      full_name: [, Validators.required],
      gender: [, Validators.required],
      date_birth: [, Validators.required],
      phone: [],
      email: [],
      address: [],
      blood_type: [],
      allergies: [],
      medical_history: [],
    });
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  savePaciente() {
    if (!this.formPaciente.valid) {
      return this.formPaciente.markAllAsTouched();
    }
    console.log(this.pacienteService.paciente);
    if (this.paciente && this.paciente.hasOwnProperty('id') && this.paciente.id) {
      return this.pacienteService
        .update(this.pacienteService.paciente.value)
        .subscribe(() => {
          this.pacienteService.getAllPatients();
          this.activeModal.close();
        });
    }


    this.pacienteService
      .create(this.pacienteService.paciente.value)
      .subscribe(() => {
        this.pacienteService.getAllPatients();
        this.activeModal.close();
      });
  }

  getDate(dateInput: string) {
    const date = new Date(dateInput);
    const day = String(date.getDate()).padStart(2, '0'); // Obtener el día del mes
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtener el mes (sumando 1 porque getMonth() devuelve un valor entre 0 y 11)
    const year = date.getFullYear(); // Obtener el año completo

    return `${day}/${month}/${year}`;  }
}
