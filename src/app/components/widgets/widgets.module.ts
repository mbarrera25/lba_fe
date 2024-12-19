import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetsComponent } from './widgets/widgets.component';
import { WidgetsRoutingModule } from './widgets-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormSolicitudComponent } from './widgets/form-solicitud/form-solicitud.component';
import { FormSearcherPatientComponent } from './widgets/form-solicitud/form-searcher-patient/form-searcher-patient.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomSearchSelectComponent } from 'src/app/shared/custom-search-select/custom-search-select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvoiceComponent } from './widgets/invoice/invoice.component';
import { AddIgtfComponent } from './widgets/invoice/add-igtf/add-igtf.component';



@NgModule({
  declarations: [WidgetsComponent, FormSolicitudComponent, FormSearcherPatientComponent, CustomSearchSelectComponent, InvoiceComponent, AddIgtfComponent],
  imports: [
    CommonModule,
    WidgetsRoutingModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule

  ]
})
export class WidgetsModule { }
