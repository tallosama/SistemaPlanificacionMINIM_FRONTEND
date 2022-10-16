import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component'; 
import { canActivate ,redirectUnauthorizedTo} from '@angular/fire/compat/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['auth/login']);


const routes: Routes = [{
  path: '',
  component: PagesComponent,...canActivate(redirectUnauthorizedToLogin) ,
  children: [
    {
      path: 'dashboard',
      component: ECommerceComponent,
    },
    {
      path: 'iot-dashboard',
      component: DashboardComponent,
    },
    {
      path: 'layout',
      loadChildren: () => import('./layout/layout.module')
        .then(m => m.LayoutModule),
    },
    {
      path: 'Area',
      loadChildren: () => import('./Catalogos/Area/area.module')
        .then(a => a.AreaModule),
    },
    {
      path: 'Categoria',
      loadChildren: () => import('./Catalogos/Categoria/categoria.module')
        .then(a => a.CategoriaModule),
    },
    {
      path: 'Sector',
      loadChildren: () => import('./Catalogos/Sector/sector.module')
        .then(a => a.SectorModule),
    },
    {
      path: 'UnidadMedida',
      loadChildren: () => import('./Catalogos/UnidadMedida/medida.module')
        .then(a => a.MedidaModule),
    },
    {
      path: 'Producto',
      loadChildren: () => import('./Catalogos/Producto/producto.module')
        .then(a => a.ProductoModule),
    },
    {
      path: 'Persona',
      loadChildren: () => import('./Catalogos/Persona/persona.module')
        .then(a => a.PersonaModule),
    },
    {
      path: 'Vehiculo',
      loadChildren: () => import('./Catalogos/Vehiculo/Vehiculo.module')
        .then(a => a.VehiculoModule),
    },
    {
      path: 'Rol',
      loadChildren: () => import('./Catalogos/Rol/rol.module')
        .then(a => a.RolModule),
    },
    {
      path: 'Usuario',
      loadChildren: () => import('./Usuario/usuario.module')
        .then(a => a.UsuarioModule),
    },
    {
      path: 'forms',
      loadChildren: () => import('./forms/forms.module')
        .then(m => m.FormsModule),
    },
    {
      path: 'ui-features',
      loadChildren: () => import('./ui-features/ui-features.module')
        .then(m => m.UiFeaturesModule),
    },
    {
      path: 'modal-overlays',
      loadChildren: () => import('./modal-overlays/modal-overlays.module')
        .then(m => m.ModalOverlaysModule),
    },
    {
      path: 'extra-components',
      loadChildren: () => import('./extra-components/extra-components.module')
        .then(m => m.ExtraComponentsModule),
    },
    {
      path: 'maps',
      loadChildren: () => import('./maps/maps.module')
        .then(m => m.MapsModule),
    },
    {
      path: 'charts',
      loadChildren: () => import('./charts/charts.module')
        .then(m => m.ChartsModule),
    },
    {
      path: 'editors',
      loadChildren: () => import('./editors/editors.module')
        .then(m => m.EditorsModule),
    },
    {
      path: 'tables',
      loadChildren: () => import('./tables/tables.module')
        .then(m => m.TablesModule),
    },
    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
