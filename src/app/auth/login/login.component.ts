import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { authService } from '../../auth/auth.service';
@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
})
export class NgxLoginComponent implements OnInit {
  loginForm: FormGroup;
  respuesta: string = "";
  constructor(public fb: FormBuilder, private authService: authService, private router: Router,
    private route: ActivatedRoute, private toastrService: NbToastrService) { }
 
    ngOnInit(): void {
    this.loginForm = this.fb.group(
      {
        correo: ['', Validators.compose([Validators.required, Validators.email])],
        clave: ['', Validators.required],
      }
    );
  }
  private errores(code: any) {
    if (code === "auth/invalid-email") {
      return "Correo no válido";
    }
    if (code === "auth/user-disabled") {
      return "El correo ha sido deshabilitado";
    }
    if (code === "auth/user-not-found") {
      return "No se ha encontrado una cuenta vinculada a ese correo";
    }
    if (code === "auth/wrong-password") {
      return "Contraseña errónea";
    }
    if(code==="auth/too-many-requests")
    {
      return "La cuenta ha sido suspendida porque se ha intentado acceder varias veces"
    }
    return "Error desconocido " + code;
  }
  async login() {
    await this.authService.login(this.loginForm.value).then(r => {
    
      this.showToast('success', 'Bienvenido', 'Se ha iniciado sesión ', 4000);
      
      this.router.navigate(['/'], { relativeTo: this.route });
      
    }).catch(e => {
      console.error(e);
     
      this.respuesta = this.errores(e.code);
    });
    
  }

  //construccion del mensaje
  public showToast(estado: string, titulo: string, cuerpo: string, duracion: number) {
    const config = {
      status: estado,
      destroyByClick: true,
      duration: duracion,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: false,
    };

    this.toastrService.show(
      cuerpo,
      `${titulo}`,
      config);
  }

}