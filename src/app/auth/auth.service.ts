import { Injectable, OnDestroy } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: "root",
})
export class authService implements OnDestroy {
  constructor(
    private authFire: AngularFireAuth,
    private fireStore: AngularFirestore
  ) {}
  ngOnDestroy(): void {}

  public login(correo: string, clave: string) {
    return this.authFire.signInWithEmailAndPassword(correo, clave);
  }
  public request(correo: string) {
    return this.authFire.sendPasswordResetEmail(correo);
  }
  public sigin(correo: string, clave: string) {
    return this.authFire.createUserWithEmailAndPassword(correo, clave);
  }
  public coleccionUsuario(data: any, path: string, uid: string) {
    return this.fireStore.collection(path).doc(uid).set(data);
  }
  public getUser$() {
    return this.authFire.user;
  }

  public getUserStorage() {
    if (localStorage.getItem("usuario") == null) {
      this.getUser$().subscribe((u) =>
        localStorage.setItem("usuario", JSON.stringify(u))
      );
    }

    return JSON.parse(localStorage.getItem("usuario"));
  }
  public logout() {
    localStorage.clear();
    return this.authFire.signOut();
  }
}
