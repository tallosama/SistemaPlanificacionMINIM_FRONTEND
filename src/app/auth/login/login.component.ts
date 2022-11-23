import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NbGlobalPhysicalPosition, NbToastrService } from "@nebular/theme";
import { authService } from "../../auth/auth.service";
@Component({
  selector: "ngx-login",
  templateUrl: "./login.component.html",
})
export class NgxLoginComponent implements OnInit {
  loginForm: FormGroup;
  respuesta: string = "";
  constructor(
    public fb: FormBuilder,
    private authService: authService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: NbToastrService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo: ["", Validators.compose([Validators.required, Validators.email])],
      clave: ["", Validators.required],
      recordar: [false],
    });
  }
  private errores(code: any) {
    if (code === "auth/invalid-email") {
      return "Correo no válido";
    }
    if (code === "auth/user-disabled") {
      return "La cuenta ha sido deshabilitada";
    }
    if (code === "auth/user-not-found") {
      return "No se ha encontrado una cuenta vinculada a ese correo";
    }
    if (code === "auth/wrong-password") {
      return "Contraseña errónea";
    }
    if (code === "auth/too-many-requests") {
      return "La cuenta ha sido suspendida porque se ha intentado acceder varias veces";
    }
    if (code === "auth/network-request-failed") {
      return "No se pudo iniciar sesión por problemas de conexión";
    }

    return "Error desconocido " + code;
  }
  async login() {
    try {
      //debugger;
      let usuario = await this.authService.login(
        this.loginForm.controls.correo.value,
        this.loginForm.controls.clave.value
      );
      if (usuario.user) {
        this.showToast("success", "Bienvenido", "Se ha iniciado sesión ", 4000);

        let userJson = usuario.user.toJSON();
        userJson["recordar"] = this.loginForm.controls.recordar.value;
        this.authService.saveUserStorage(userJson);

        this.router.navigate(["/"], { relativeTo: this.route });
      }
    } catch (e) {
      console.error(e);
      this.respuesta = this.errores(e.code);
    }

    //Solamente con promesas
    // await this.authService
    // .login(
    //   this.loginForm.controls.correo.value,
    //   this.loginForm.controls.clave.value
    // )
    // .then((r) => {
    //   this.showToast("success", "Bienvenido", "Se ha iniciado sesión ", 4000);
    //   localStorage.setItem("usuario", JSON.stringify(r.user.toJSON()));
    //   this.router.navigate(["/"], { relativeTo: this.route });
    // })
    // .catch((e) => {
    //   console.error(e);

    //   this.respuesta = this.errores(e.code);
    // });
  }

  // hash256(clave): any {
  //   const utf8 = new TextEncoder().encode(clave);
  //   return crypto.subtle.digest("SHA-256", utf8).then((hashBuffer) => {
  //     const hashArray = Array.from(new Uint8Array(hashBuffer));
  //     const hashHex = hashArray
  //       .map((bytes) => bytes.toString(16).padStart(2, "0"))
  //       .join("");
  //     return hashHex;
  //   });
  // }
  //construccion del mensaje
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
}
