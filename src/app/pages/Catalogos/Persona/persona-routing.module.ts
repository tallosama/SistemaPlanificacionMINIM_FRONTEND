import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearComponent } from './Crear/crear/crear.component';
import { EditarComponent } from './Editar/editar/editar.component';
import { ListadoComponent } from './Listado/listado/listado.component';

const routes: Routes = [{

  path: 'ListarPersona',
  component: ListadoComponent,
},
{
  path: 'RegistrarPersona',
  component: CrearComponent,
},
{
  path: 'EditarPersona/:id',
  component: EditarComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonaRoutingModule { }
