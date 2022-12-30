import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AsignacionComponent } from "./Asignacion/asignacion/asignacion.component";

const routes: Routes = [
  {
    path: "Asignacion",
    component: AsignacionComponent,
  },

  // {
  //   path: 'EditarArea/:id',
  //   component: EditarComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransporteRoutingModule {}
