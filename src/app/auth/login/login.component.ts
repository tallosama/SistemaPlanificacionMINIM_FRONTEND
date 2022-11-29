import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NbGlobalPhysicalPosition, NbToastrService } from "@nebular/theme";
import { Subscription } from "rxjs";
import { authService } from "../../auth/auth.service";
import { PersonaService } from "../../pages/Catalogos/Persona/persona.service";
@Component({
  selector: "ngx-login",
  templateUrl: "./login.component.html",
})
export class NgxLoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  respuestaErrores: string = "";
  subscripciones: Array<Subscription> = [];
  constructor(
    public fb: FormBuilder,
    private authService: authService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
    private personaService: PersonaService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo: ["", Validators.compose([Validators.required, Validators.email])],
      clave: ["", Validators.required],
      recordar: [false],
    });
  }
  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe());
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
  private async findUserData() {
    let promMetadata = this.authService
      .findUserDB(this.loginForm.controls.correo.value)
      .toPromise();
    return promMetadata;
  }
  async login() {
    this.respuestaErrores = "";
    try {
      //debugger;
      let usuario = await this.authService.login(
        this.loginForm.controls.correo.value,
        this.loginForm.controls.clave.value
      );
      let respuesta = await this.findUserData();
      //validación de que el usuario exista en la bd de fb y que tenga cuenta en fb
      if (usuario.user && respuesta.exists) {
        const esActivo = respuesta.data()["Estado"];

        if (esActivo) {
          this.showToast(
            "success",
            "Bienvenido",
            "Se ha iniciado sesión ",
            4000
          );
          let userJson = usuario.user.toJSON();
          userJson["recordar"] = this.loginForm.controls.recordar.value;
          this.authService.saveUserStorage(userJson);

          this.router.navigate(["/"], { relativeTo: this.route });
        } else {
          this.showToast(
            "warning",
            "Atención",
            "Su cuenta se encuentra desactivada, contacte al administrador para reactivarla ",
            10000
          );
          this.authService.logout();
        }
      } else {
        this.showToast(
          "warning",
          "Atención",
          "La cuenta ingresada no posee la información adicional requerida para iniciar sesión, contacte al administrador para completar la información de su cuenta ",
          10000
        );
        this.authService.logout();
      }
    } catch (e) {
      //Muestra los errores en consola
      console.error(e);
      //Muestra los errores lanzados desde firebase en pantalla
      this.respuestaErrores = this.errores(e.code);

      //Se valida el error lanzado para así proceder a eliminar el registro de la base de datos fb en caso de que exista el correo ingresado
      if (
        this.respuestaErrores ===
        "No se ha encontrado una cuenta vinculada a ese correo"
      ) {
        this.borrarRegistro();
      }
    }
  }
  private async borrarRegistro() {
    //Se busca el usuario en fbbd
    let res = await this.findUserData();
    //Si existe se elimina de fb y de posgreSQL
    if (res.exists) {
      this.subscripciones.push(
        this.personaService.buscar(res.data()["PersonaId"]).subscribe(
          (p) => {
            //Se cambia el estado de posee usuario a false antes de eliminarlo de fbbd
            p.poseeUsuario = false;
            this.actualizarPersona(p);
          },
          (error) => {
            console.error(
              "Mientras se buscaba la persona a cambiar el estado" + error
            );
          }
        )
      );
      try {
        await this.authService.deleteUserDB(res.data()["Correo"]);
      } catch (e) {
        console.error(e);
      }
    }
  }
  private async actualizarPersona(persona) {
    try {
      await this.personaService.editar(persona.idPersona, persona).toPromise();
    } catch (error) {
      console.error(error);
    }
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
