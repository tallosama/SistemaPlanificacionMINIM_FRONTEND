import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EventosComponent } from "./eventos/eventos.component";

const routes: Routes = [
  {
    path: "RegistrarEventos",
    component: EventosComponent,
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
export class EventosRoutingModule {}
