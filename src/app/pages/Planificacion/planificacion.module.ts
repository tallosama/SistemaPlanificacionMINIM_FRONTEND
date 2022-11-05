import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PlanificacionRoutingModule } from "./planificacion-routing.module";
import { CrearComponent } from "./Crear/crear/crear.component";
import { EditarComponent } from "./Editar/editar/editar.component";
import { ListadoComponent } from "./Listado/listado/listado.component";
import {
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbDatepickerModule,
  NbDialogModule,
  NbInputModule,
} from "@nebular/theme";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";

@NgModule({
  declarations: [CrearComponent, EditarComponent, ListadoComponent],
  imports: [
    CommonModule,
    PlanificacionRoutingModule,
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
    //fechas
    NbDatepickerModule,
  ],
})
export class PlanificacionModule {}
