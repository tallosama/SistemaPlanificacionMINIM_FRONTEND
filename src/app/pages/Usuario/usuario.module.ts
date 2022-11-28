import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UsuarioRoutingModule } from "./usuario-routing.module";
import { CrearUsuarioComponent } from "./Registrar/Crear/crear-usuario/crear-usuario.component";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NbButtonModule,
  NbCardModule,
  NbDialogModule,
  NbInputModule,
  NbSelectModule,
  NbStepperModule,
} from "@nebular/theme";
import { DataTablesModule } from "angular-datatables";
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { ListadoComponent } from './Listado/listado/listado.component';
import { EditarComponent } from './Editar/editar/editar.component';

@NgModule({
  declarations: [CrearUsuarioComponent, ListadoComponent, EditarComponent],
  imports: [
    CommonModule,
    UsuarioRoutingModule,
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
    //para combobox
    NbSelectModule,
    //Stmarttable
    Ng2SmartTableModule,
  ],
})
export class UsuarioModule {}
