import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EventosRoutingModule } from "./eventos-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NbButtonModule,
  NbCardModule,
  NbDatepickerModule,
  NbDialogModule,
  NbInputModule,
  NbStepperModule,
  NbTimepickerModule,
} from "@nebular/theme";
import { DataTablesModule } from "angular-datatables";
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { EventosComponent } from "./eventos/eventos.component";
import { Ng2SmartTableModule } from "ng2-smart-table";

@NgModule({
  declarations: [EventosComponent],
  imports: [
    CommonModule,
    EventosRoutingModule,
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
    //Datatables
    DataTablesModule,
    //para mostrar paso a paso
    NbStepperModule,
    //Modulo de autocompletado
    AutocompleteLibModule,

    //    Para input horas
    NbTimepickerModule,

    //   para fechas
    //NbDatepickerModule,

    //Stmarttable
    Ng2SmartTableModule,
  ],
})
export class EventosModule {}
