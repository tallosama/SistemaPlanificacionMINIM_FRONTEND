import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EditarComponent } from "./Editar/editar/editar.component";
import { ListadoComponent } from "./Listado/listado/listado.component";
import { CrearUsuarioComponent } from "./Registrar/Crear/crear-usuario/crear-usuario.component";

const routes: Routes = [
  {
    path: "RegistrarUsuario",
    component: CrearUsuarioComponent,
  },
  {
    path: "VerUsuarios",
    component: ListadoComponent,
  },
  // {
  //   path: "EditarUsuario/:id",
  //   component: EditarComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuarioRoutingModule {}
