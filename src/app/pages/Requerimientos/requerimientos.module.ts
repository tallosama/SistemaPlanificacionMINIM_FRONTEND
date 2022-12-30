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
  NbSelectModule,
} from "@nebular/theme";
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { RenderEquipoComponent } from "./Solicitud/Renders/render-equipo/render-equipo.component";
import { RenderTransporteComponent } from "./Solicitud/Renders/render-transporte/render-transporte.component";
import { SolicitudEquipoComponent } from "./Solicitud/Modales/solicitud-equipo/solicitud-equipo.component";
import { SolicitudTransporteComponent } from "./Solicitud/Modales/solicitud-transporte/solicitud-transporte.component";
import { SolicitudRequerimientoComponent } from "./Solicitud/Modales/solicitud-requerimiento/solicitud-requerimiento.component";
import { RenderRequerimientoComponent } from "./Solicitud/Renders/render-requerimiento/render-requerimiento.component";
import { RenderAprobacionComponent } from "./Solicitud/Renders/render-aprobacion/render-aprobacion.component";
import { AprobacionComponent } from "./Solicitud/Modales/aprobacion/aprobacion.component";

@NgModule({
  declarations: [
    SolicitudComponent,
    RenderEquipoComponent,
    RenderAprobacionComponent,
    RenderTransporteComponent,
    SolicitudEquipoComponent,
    AprobacionComponent,
    SolicitudTransporteComponent,
    SolicitudRequerimientoComponent,
    RenderRequerimientoComponent,
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
    NbSelectModule,
  ],
})
export class RequerimientosModule {}
