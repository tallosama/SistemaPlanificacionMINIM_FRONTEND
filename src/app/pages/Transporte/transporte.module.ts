import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TransporteRoutingModule } from "./transporte-routing.module";
import { AsignacionComponent } from "./Asignacion/asignacion/asignacion.component";
import { DetalleEventoHoraComponent } from "./Asignacion/Renders/detalle-evento-hora/detalle-evento-hora.component";
import { DetalleEventoFechaComponent } from "./Asignacion/Renders/detalle-evento-fecha/detalle-evento-fecha.component";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NbButtonModule,
  NbCardModule,
  NbDialogModule,
  NbInputModule,
  NbSelectModule,
} from "@nebular/theme";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { AsignarTransporteComponent } from "./Asignacion/asignacion/Modales/asignar-transporte/asignar-transporte.component";
import { TerminarRequerimientoComponent } from "./Asignacion/asignacion/Modales/terminar-requerimiento/terminar-requerimiento.component";
import { HistorialComponent } from "./Historial/historial/historial.component";

import { RenderVehiculoPlacaComponent } from "./Historial/historial/Renders/render-vehiculo-placa/render-vehiculo-placa.component";
import { RenderVehiculoMarcaComponent } from "./Historial/historial/Renders/render-vehiculo-marca/render-vehiculo-marca.component";
import { RenderRequerimientoFechaComponent } from "./Historial/historial/Renders/render-requerimiento-fecha/render-requerimiento-fecha.component";
import { RenderRequerimientoHoraComponent } from './Historial/historial/Renders/render-requerimiento-hora/render-requerimiento-hora.component';
import { RenderRequerimientoEventoComponent } from './Historial/historial/Renders/render-requerimiento-evento/render-requerimiento-evento.component';
import { RenderDescripcionRequerimientoComponent } from './Historial/historial/Renders/render-descripcion-requerimiento/render-descripcion-requerimiento.component';

@NgModule({
  declarations: [
    AsignacionComponent,
    DetalleEventoHoraComponent,
    DetalleEventoFechaComponent,
    AsignarTransporteComponent,
    TerminarRequerimientoComponent,
    HistorialComponent,
    RenderVehiculoPlacaComponent,
    RenderVehiculoMarcaComponent,
    RenderRequerimientoFechaComponent,
    RenderRequerimientoHoraComponent,
    RenderRequerimientoEventoComponent,
    RenderDescripcionRequerimientoComponent,
  ],
  imports: [
    CommonModule,
    TransporteRoutingModule,

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

    //Modulo de autocompletado
    //AutocompleteLibModule,

    //   para fechas
    //NbDatepickerModule,

    //Stmarttable
    Ng2SmartTableModule,
    NbSelectModule,
  ],
})
export class TransporteModule {}
