import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BuscarComponent } from "./Buscar/buscar/buscar.component";
import { PersonasAsignadasComponent } from "./Buscar/personas-asignadas/personas-asignadas.component";
import { EventosComponent } from "./eventos/eventos.component";

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
    path: "Eventos",
    component: PersonasAsignadasComponent,
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
