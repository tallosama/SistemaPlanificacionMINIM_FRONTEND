import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioRoutingModule } from './usuario-routing.module';
import { ListadoPersonalComponent } from './Registrar/ListarPersonas/listado-personal/listado-personal.component';
import { CrearUsuarioComponent } from './Registrar/Crear/crear-usuario/crear-usuario.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbAlertModule, NbButtonModule, NbCardModule, NbDialogModule, NbInputModule, NbStepperModule  } from '@nebular/theme';
import { DataTablesModule } from 'angular-datatables'; 

@NgModule({
  declarations: [
    ListadoPersonalComponent,
    CrearUsuarioComponent,

  ],
  imports: [
    CommonModule,
    UsuarioRoutingModule,
    CommonModule,
    //permite utilizar peticiones http
    HttpClientModule,
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

    NbDialogModule.forChild(),
    //Datatables
    DataTablesModule,
    //para mostrar paso a paso
    NbStepperModule,
  ]
})
export class UsuarioModule { }
