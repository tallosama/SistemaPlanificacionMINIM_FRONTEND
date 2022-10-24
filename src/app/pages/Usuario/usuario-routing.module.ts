import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CrearUsuarioComponent } from "./Registrar/Crear/crear-usuario/crear-usuario.component";

const routes: Routes = [
  {
    path: "RegistrarUsuario",
    component: CrearUsuarioComponent,
  },
  // {
  //   path: 'RegistrarArea',
  //   component: CrearComponent,
  // },
  // {
  //   path: 'EditarArea/:id',
  //   component: EditarComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuarioRoutingModule {}
