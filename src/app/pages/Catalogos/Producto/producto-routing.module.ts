import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearComponent } from './Crear/crear/crear.component';
import { EditarComponent } from './Editar/editar/editar.component';
import { ListadoComponent } from './Listado/listado/listado.component';

const routes: Routes = [
  {
    path: 'ListarProducto',
    component: ListadoComponent,
  },
  {
    path: 'RegistrarProducto',
    component: CrearComponent,
  },
  {
    path: 'EditarProducto/:id',
    component: EditarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductoRoutingModule { }
