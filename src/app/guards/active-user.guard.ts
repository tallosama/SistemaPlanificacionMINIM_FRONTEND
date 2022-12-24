import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  RouterStateSnapshot,
} from "@angular/router";
import { NbGlobalPhysicalPosition, NbToastrService } from "@nebular/theme";
import { Observable } from "rxjs";
import { authService } from "../auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class ActiveUserGuard implements CanActivateChild {
  constructor(
    private auth: authService,
    private toastrService: NbToastrService
  ) {}
  // construccion del mensaje
  public showToast(
    estado: string,
    titulo: string,
    cuerpo: string,
    duracion: number
  ) {
    const config = {
      status: estado,
      destroyByClick: true,
      duration: duracion,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: false,
    };

    this.toastrService.show(cuerpo, `${titulo}`, config);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // return new Promise((promesaUser) => {
    //   this.auth
    //     .findUserDB(this.auth.getUserStorage()["email"])
    //     .toPromise()
    //     .then((res) => {
    //       if (res.data()["Estado"]) {
    //         promesaUser(true);
    //       } else {
    //         promesaUser(false);

    //         this.auth.logout();
    //       }
    //     })
    //     .catch((e) => {
    //       this.showToast(
    //         "danger",
    //         "Error ",
    //         "Mientras se comunicaba con la base de datos se detectó '" +
    //           e +
    //           "'",
    //         0
    //       );
    //       console.error(e);
    //     });
    // });
    return true;
  }
}
