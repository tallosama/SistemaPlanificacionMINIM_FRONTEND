import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EntradaRoutingModule } from "./entrada-routing.module";
import { CrearComponent } from "./Crear/crear/crear.component";
import { EditarComponent } from "./Editar/editar/editar.component";
import { ListarComponent } from "./Listar/listar/listar.component";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbDatepickerModule,
  NbDialogModule,
  NbInputModule,
} from "@nebular/theme";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { AutocompleteLibModule } from "angular-ng-autocomplete";

@NgModule({
  declarations: [CrearComponent, EditarComponent, ListarComponent],
  imports: [
    CommonModule,
    EntradaRoutingModule,
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
    //fechas
    NbDatepickerModule,

    //Modulo de autocompletado
    AutocompleteLibModule,
  ],
})
export class EntradaModule {}
