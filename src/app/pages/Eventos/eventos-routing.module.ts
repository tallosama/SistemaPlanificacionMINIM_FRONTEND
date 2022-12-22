import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BuscarComponent } from "./Buscar/buscar/buscar.component";
import { EventosComponent } from "./eventos/eventos.component";
import { SeguimientoEventoComponent } from "./seguimiento-evento/seguimiento-evento.component";

const routes: Routes = [
  {
    path: "RegistrarEventos",
    component: EventosComponent,
  },
  {
    path: "BuscarEventos",
    component: BuscarComponent,
  },
  {
    path: "SeguimientoEvento",
    component: SeguimientoEventoComponent,
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
export class EventosRoutingModule {}
