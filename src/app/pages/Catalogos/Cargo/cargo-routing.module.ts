import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CrearComponent } from "./Crear/crear/crear.component";
import { EditarComponent } from "./Editar/editar/editar.component";
import { ListadoComponent } from "./Listado/listado/listado.component";

const routes: Routes = [
  {
    path: "ListarCargo",
    component: ListadoComponent,
  },
  {
    path: "RegistrarCargo",
    component: CrearComponent,
  },
  {
    path: "EditarCargo/:id",
    component: EditarComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CargoRoutingModule {}
