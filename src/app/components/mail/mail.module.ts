import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewMailComponent } from './view-mail/view-mail.component';
import { MailRoutingModule } from './mail-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfiguracionComponent } from './configuracion.component';
import { TalonariosComponent } from './talonarios/talonarios.component';
import { ExchangeRateComponent } from './exchange-rate/exchange-rate.component';
import { MetodosPagosComponent } from './metodos-pagos/metodos-pagos.component';



@NgModule({
  declarations: [
    ConfiguracionComponent,
    ViewMailComponent,
    TalonariosComponent,
    ExchangeRateComponent,
    MetodosPagosComponent],
  imports: [
    CommonModule,
    MailRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    NgSelectModule,
  ]
})
export class MailModule { }
