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
  /**
   * This function takes in a data object, a path string, and a uid string, and returns a promise that
   * resolves to a firestore document reference.
   * @param {any} data - any =&gt; this is the data you want to store in the database
   * @param {string} path - the path to the collection
   * @param {string} uid - the user's id
   * @returns The promise of the set method.
   */
  public coleccionUsuario(data: any, path: string, uid: string) {
    return this.fireStore.collection(path).doc(uid).set(data);
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
}
