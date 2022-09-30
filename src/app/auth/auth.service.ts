import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class authService {

  constructor(private authFire:AngularFireAuth) { }

  public login(credenciales:any){
    return this.authFire.signInWithEmailAndPassword(credenciales.correo,credenciales.clave);
  }

  public user(){
    return this.authFire.currentUser;
  }
}
