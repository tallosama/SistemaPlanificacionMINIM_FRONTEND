import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RequerimientosRoutingModule } from "./requerimientos-routing.module";
import { SolicitudComponent } from "./Solicitud/solicitud/solicitud.component";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NbButtonModule,
  NbCardModule,
  NbDialogModule,
  NbInputModule,
} from "@nebular/theme";
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { RenderEquipoComponent } from "./Solicitud/Renders/render-equipo/render-equipo.component";
import { RenderMaterialesComponent } from "./Solicitud/Renders/render-materiales/render-materiales.component";
import { RenderTransporteComponent } from "./Solicitud/Renders/render-transporte/render-transporte.component";

@NgModule({
  declarations: [
    SolicitudComponent,
    RenderEquipoComponent,
    RenderMaterialesComponent,
    RenderTransporteComponent,
  ],
  imports: [
    CommonModule,
    RequerimientosRoutingModule,
    //permite utilizar peticiones http
    HttpClientModule,
    //Permite usar los form builders
    ReactiveFormsModule,
    //Este modulo permite agregar codigo TS en los formularios
    FormsModule,

    //este es para los formularios
    NbInputModule,
    NbCardModule,
    NbButtonModule,

    NbDialogModule.forChild(),

    //para mostrar paso a paso
    // NbStepperModule,
    //Modulo de autocompletado
    AutocompleteLibModule,

    //    Para input horas
    // NbTimepickerModule,

    //   para fechas
    //NbDatepickerModule,

    //Stmarttable
    Ng2SmartTableModule,
    // NbSelectModule,
  ],
})
export class RequerimientosModule {}
