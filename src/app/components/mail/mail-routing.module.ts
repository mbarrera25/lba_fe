import { ConfiguracionComponent } from './configuracion.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewMailComponent } from './view-mail/view-mail.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'mail-inbox',
        component: ConfiguracionComponent
      },
      {
        path: 'view-mail',
        component: ViewMailComponent
      },
    ]
  }

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class  MailRoutingModule{ }
