import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListadoComponent } from "../../Usuario/Listado/listado/listado.component";
import { CrearComponent } from "./Crear/crear/crear.component";
import { EditarComponent } from "./Editar/editar/editar.component";

const routes: Routes = [
  {
    path: "ListarEntrada",
    component: ListadoComponent,
  },
  {
    path: "RegistrarEntrada",
    component: CrearComponent,
  },
  {
    path: "EditarEntrada/:id",
    component: EditarComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntradaRoutingModule {}
