import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearComponent } from './Crear/crear/crear.component';
import { EditarComponent } from './Editar/editar/editar.component';
import { ListadoComponent } from './Listado/listado/listado.component';

const routes: Routes = [{
  path: '',
  component: ListadoComponent,
},
{
  path: 'ListarAreas',
  component: ListadoComponent,
},
{
  path: 'RegistrarArea',
  component: CrearComponent,
},
{
  path: 'EditarArea/:id',
  component: EditarComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AreaRoutingModule { }
