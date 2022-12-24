import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SolicitudComponent } from "./Solicitud/solicitud/solicitud.component";

const routes: Routes = [
  {
    path: "SolicitudRequerimientos",
    component: SolicitudComponent,
  },
  // {
  //   path: "RegistrarPlanificacion",
  //   component: CrearComponent,
  // },
  // {
  //   path: "EditarPlanificacion/:id",
  //   component: EditarComponent,
  // }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequerimientosRoutingModule {}
