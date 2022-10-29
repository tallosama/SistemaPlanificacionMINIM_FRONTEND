import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NbAuthComponent } from "@nebular/auth";
import { NotFoundComponent } from "../pages/miscellaneous/not-found/not-found.component";

import { NgxLoginComponent } from "./login/login.component"; // <---
import { NgxRequestPasswordComponent } from "./request-password/request-password.component";

export const routes: Routes = [
  {
    path: "",
    component: NbAuthComponent,
    children: [
      {
        path: "login",
        component: NgxLoginComponent, // <---
      },
      {
        path: "request",
        component: NgxRequestPasswordComponent, // <---
      },
      {
        path: "",
        redirectTo: "login",
        pathMatch: "full",
      },
      {
        path: "**",
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NgxAuthRoutingModule {}
