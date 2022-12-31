import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbDialogModule,
  NbInputModule,
  NbSelectModule,
} from "@nebular/theme";
import { Ng2SmartTableModule } from "ng2-smart-table";

import { CrearComponent } from "./Crear/crear/crear.component";
import { EditarComponent } from "./Editar/editar/editar.component";
import { ListadoComponent } from "./Listado/listado/listado.component";
import { VehiculoRoutingModule } from "./vehiculo-routing.module";

@NgModule({
  declarations: [CrearComponent, EditarComponent, ListadoComponent],
  imports: [
    CommonModule,
    VehiculoRoutingModule,
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
    //Stmarttable
    Ng2SmartTableModule,
    NbSelectModule,
  ],
})
export class VehiculoModule {}
