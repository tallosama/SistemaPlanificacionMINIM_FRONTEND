import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CrearComponent } from "./Crear/crear/crear.component";
import { EditarComponent } from "./Editar/editar/editar.component";
import { ListarComponent } from "./Listar/listar/listar.component";

const routes: Routes = [
  {
    path: "ListarEntrada",
    component: ListarComponent,
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
