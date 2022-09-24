import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private authFire:AngularFireAuth) { }

  public login(user:any, pass:any){
    return this.authFire.signInWithEmailAndPassword(user,pass);
  }
}
