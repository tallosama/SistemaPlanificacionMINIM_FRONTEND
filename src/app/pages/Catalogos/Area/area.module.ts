import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AreaRoutingModule } from "./area-routing.module";
import { ListadoComponent } from "./Listado/listado/listado.component";
import { CrearComponent } from "./Crear/crear/crear.component";
import { EditarComponent } from "./Editar/editar/editar.component";
import {
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbDialogModule,
  NbInputModule,
} from "@nebular/theme";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Ng2SmartTableModule } from "ng2-smart-table";

@NgModule({
  declarations: [ListadoComponent, CrearComponent, EditarComponent],
  imports: [
    CommonModule,
    AreaRoutingModule,
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

    ////Stmarttable
    Ng2SmartTableModule,
  ],
})
export class AreaModule {}
