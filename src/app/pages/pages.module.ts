import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { AreaModule } from './Catalogos/Area/area.module';
import { CategoriaModule } from './Catalogos/Categoria/categoria.module';
import { SectorModule } from './Catalogos/Sector/sector.module';
import { MedidaModule } from './Catalogos/UnidadMedida/medida.module';
import { ProductoModule } from './Catalogos/Producto/producto.module';
import { PersonaModule } from './Catalogos/Persona/persona.module';
import { VehiculoModule } from './Catalogos/Vehiculo/vehiculo.module';
import { RolModule } from './Catalogos/Rol/rol.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    
    AreaModule,
    CategoriaModule,
    SectorModule,
    MedidaModule,
    ProductoModule,
    PersonaModule,
    VehiculoModule,
    RolModule
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}
