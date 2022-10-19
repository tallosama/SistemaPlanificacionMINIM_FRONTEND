import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class authService {

  constructor(private authFire: AngularFireAuth,
    private fireStore: AngularFirestore
  ) { }



  public login(credenciales: any) {
    return this.authFire.signInWithEmailAndPassword(credenciales.correo, credenciales.clave);
  }
  public sigin(credenciales: any) {
    return this.authFire.createUserWithEmailAndPassword(credenciales.Correo, credenciales.Clave);
  }
  public coleccionUsuario(data: any, path: string, uid: string) {
    return this.fireStore.collection(path).doc(uid).set(data);
  }
  public getUser() {
    return this.authFire.currentUser;
  }
  public logout() {
    return this.authFire.signOut();
  }
}
