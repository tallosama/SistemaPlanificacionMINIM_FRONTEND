import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { ActivatedRoute, Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class authService {
  constructor(
    private authFire: AngularFireAuth,
    private fireStore: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  public login(correo: string, clave: string) {
    return this.authFire.signInWithEmailAndPassword(correo, clave);
  }
  public request(correo: string) {
    return this.authFire.sendPasswordResetEmail(correo);
  }
  public sigin(correo: string, clave: string) {
    return this.authFire.createUserWithEmailAndPassword(correo, clave);
  }

  public getUser$() {
    return this.authFire.user;
  }

  public async saveCurrentUserStorage() {
    let user = await this.authFire.currentUser;
    localStorage.setItem("usuario", JSON.stringify(user.toJSON()));
    return JSON.parse(localStorage.getItem("usuario"));
  }
  public getUserStorage() {
    if (localStorage.getItem("usuario") != null)
      return JSON.parse(localStorage.getItem("usuario"));
    else {
      this.logout();
    }
  }

  public saveUserStorage(user) {
    if (localStorage.getItem("usuario") != null) {
      localStorage.removeItem("usuario");
    }

    localStorage.setItem("usuario", JSON.stringify(user));
  }
  public logout() {
    localStorage.clear();
    this.authFire.signOut();
    this.router.navigate(["auth/login"], { relativeTo: this.route });
  }

  //Métodos para manipular al db de firebase
  public saveUserDB(data: any, uid: string) {
    return this.fireStore.collection("Usuario").doc(uid).set(data);
  }
  public findUserDB(doc: string) {
    return this.fireStore.collection("Usuario").doc(doc).get();
  }
  public getUsersDB() {
    return this.fireStore.collection("Usuario").get();
  }
  public deleteUserDB(doc: string) {
    return this.fireStore.collection("Usuario").doc(doc).delete();
  }

  public updateUserDB(doc: string, newData: any) {
    return this.fireStore.collection("Usuario").doc(doc).update(newData);
  }
}
