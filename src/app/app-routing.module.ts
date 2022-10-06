import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard,redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';
//import { AuthGuard } from '@auth0/auth0-angular';

export const routes: Routes = [
  {
    
    //AUTH0
    // path: 'pages',canActivate:[AuthGuard],
    // loadChildren: () => import('./pages/pages.module')
    //   .then(m => m.PagesModule),

      path: 'pages' ,
      loadChildren: () => import('./pages/pages.module')
        .then(m => m.PagesModule)
       
      },
  {

  
    path: 'auth',
    loadChildren: () => import('./auth/auth.module')
    .then(m => m.NgxAuthModule),
    
      // {
      //   path: 'register',
      //   component: NbRegisterComponent,
      // },
      // {
      //   path: 'logout',
      //   component: NbLogoutComponent,
      // },
      // {
      //   path: 'request-password',
      //   component: NbRequestPasswordComponent,
      // },
      // {
      //   path: 'reset-password',
      //   component: NbResetPasswordComponent,
      // }, 
  },
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages' },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
