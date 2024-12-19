import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import * as chartData from "../../../shared/data/ecommerce-Dash";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormPacienteComponent } from './form-paciente/form-paciente.component';
import { PacienteService } from './paciente.service';
import { iPaciente } from 'src/app/models/paciente.model';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-ecommerce-dashboard',
  templateUrl: './ecommerce-dashboard.component.html',
  styleUrls: ['./ecommerce-dashboard.component.scss']
})
export class EcommerceDashboardComponent implements OnInit {

pacientes: any;

  constructor(
    private modalService: NgbModal,
    public pacienteService: PacienteService

  ) { }

  ngOnInit(): void {
    this.pacienteService.getAllPatients()
  }

  openCreateModal(paciente: iPaciente | null = null) {
    const modalRef = this.modalService.open(FormPacienteComponent, {
      size: 'lg',
      windowClass: 'custom-modal-size',
    });

    // Pasar el paciente al componente del modal
    modalRef.componentInstance.paciente = paciente;

    // Manejar el resultado cuando se cierra el modal
    modalRef.result.then((result) => {
      // Aquí puedes manejar el resultado cuando el modal se cierra exitosamente
      console.log('Modal cerrado con resultado:', result);
    }).catch((reason) => {
      // Aquí puedes manejar cuando el modal se cierra con un rechazo o cancelación
      console.log('Modal cerrado:', reason);
    });
  }


    delete(id: number){
      Swal.fire({
        icon: 'warning',
        title: 'Eliminar...',
        text: 'Seguro que quieres eliminar este Paciente?',
        showCancelButton: true,
        confirmButtonColor: '#6259ca',
        cancelButtonColor: '#6259ca',
        confirmButtonText: 'Si',
        reverseButtons: true

      }).then(async (result) => {
        if (result.isConfirmed) {
          this.pacienteService.delete(id).pipe(
            tap(t => {
              Swal.fire({
                title: 'Eliminado!',
                text: 'El Paciente se ha eliminado',
                icon: 'success',
                confirmButtonColor: '#6259ca'
              });
              this.pacienteService.getAllPatients();
            })
          ).subscribe()

        }
      })
    }

}
