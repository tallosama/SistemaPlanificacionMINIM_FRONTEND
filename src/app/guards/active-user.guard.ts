import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { authService } from "../auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class ActiveUserGuard implements CanActivateChild {
  constructor(private auth: authService) {}

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((promesaUser) => {
      this.auth
        .findUserDB(this.auth.getUserStorage()["email"])
        .toPromise()
        .then((res) => {
          if (res.data()["Estado"]) {
            promesaUser(true);
          } else {
            promesaUser(false);

            this.auth.logout();
          }
        });
    });
  }
}
