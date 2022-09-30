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
  constructor(public fb: FormBuilder, private authService: authService, private router: Router,
    private route: ActivatedRoute,private toastrService: NbToastrService) {}
  ngOnInit(): void {
    this.loginForm = this.fb.group(
      {
        correo: ['', Validators.compose([Validators.required, Validators.email])],
        clave: ['', Validators.required], 
      }
    );
  }

  async login() {
    const res = await this.authService.login(this.loginForm.value).catch(e=>console.error(e));
    if (res) {
      this.showToast('success', 'Bienvenido', 'Se ha iniciado sesión');
      this.router.navigate(['/'], { relativeTo: this.route });
    }else{
      this.showToast('danger', 'Error al intentar iniciar sesión', 'No se han confirmado sus credenciales');
    }
  }

    //construccion del mensaje
    public showToast(estado: string, titulo: string, cuerpo: string) {
      const config = {
        status: estado,
        destroyByClick: true,
        duration: 4000,
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