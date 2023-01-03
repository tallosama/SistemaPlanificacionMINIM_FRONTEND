import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AsignacionComponent } from "./Asignacion/asignacion/asignacion.component";
import { HistorialComponent } from "./Historial/historial/historial.component";

const routes: Routes = [
  {
    path: "Asignacion",
    component: AsignacionComponent,
  },

  {
    path: "Historial",
    component: HistorialComponent,
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
