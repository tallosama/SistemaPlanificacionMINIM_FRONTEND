import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core'; 
import { RouterModule } from '@angular/router';

import { NgxAuthRoutingModule } from './auth-routing.module';
import { NbAuthModule } from '@nebular/auth';
import { NbAlertModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbInputModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoginComponent } from './login/login.component'; // <---


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NgxAuthRoutingModule,

    //NbAuthModule,

       //Permite usar los form builders
       ReactiveFormsModule,
       //Este modulo permite agregar codigo TS en los formularios
       FormsModule,
       //este es para las alertas
       NbAlertModule,
       
       //este es para los formularios
       NbInputModule,
       NbCardModule,
       NbButtonModule,
  ],
  declarations: [
    NgxLoginComponent, // <---
  ],
})
export class NgxAuthModule {
}