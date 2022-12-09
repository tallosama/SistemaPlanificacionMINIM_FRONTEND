import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SalidaRoutingModule } from "./salida-routing.module";
import { EditarComponent } from "./Editar/editar/editar.component";
import { ListarComponent } from "./Listar/listar/listar.component";
import { CrearComponent } from "./Crear/crear/crear.component";

@NgModule({
  declarations: [CrearComponent, EditarComponent, ListarComponent],
  imports: [CommonModule, SalidaRoutingModule],
})
export class SalidaModule {}
