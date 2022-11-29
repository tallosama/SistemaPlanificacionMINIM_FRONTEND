import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  NbDialogService,
  NbGlobalPhysicalPosition,
  NbStepperComponent,
  NbToastrService,
} from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { Subscription } from "rxjs";
import { authService } from "../../../../../auth/auth.service";
import { AreaService } from "../../../../Catalogos/Area/area.service";
import { PersonaService } from "../../../../Catalogos/Persona/persona.service";
import { RolService } from "../../../../Catalogos/Rol/rol.service";
import { DialogNamePromptComponent } from "../../../../modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component";

@Component({
  selector: "ngx-crear-usuario",
  templateUrl: "./crear-usuario.component.html",
  styleUrls: ["./crear-usuario.component.scss"],
})
export class CrearUsuarioComponent implements OnInit, OnDestroy {
  @ViewChild(NbStepperComponent) stepper: NbStepperComponent;
  subscripciones: Array<Subscription> = [];
  respuesta: string = "";
  //autocompletado
  keyword = "desArea";
  public historyHeading: string = "Recientes";
  roles: any;
  areas: any = [];
  usuarioForm: FormGroup;
  personaSeleccionada: any;
  usuario: any;
  fecha = new Date().toISOString().slice(0, 10);
  estado = [
    { Estado: true, Descripcion: "Activo" },
    { Estado: false, Descripcion: "Inactivo" },
  ];

  sourceSmartUsuario: LocalDataSource = new LocalDataSource();
  settings = {
    mode: "external",

    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    actions: {
      columnTitle: "Acción",
      add: false,
      delete: false,
    },

    pager: {
      display: true,
      perPage: 5,
    },
    columns: {
      cedula: {
        title: "Cédula",
        type: "string",
      },
      pNombre: {
        title: "Primer nombre",
        type: "string",
      },
      sNombre: {
        title: "Segundo nombre",
        type: "string",
      },
      pApellido: {
        title: "Primer apellido",
        type: "string",
      },
      sApellido: {
        title: "Segundo apellido",
        type: "string",
      },
      tipo: {
        title: "Tipo",
        type: "string",
      },

      estado: {
        title: "Estado",
        valuePrepareFunction: (data) => {
          return data ? "Activo" : "Inactivo";
        },
      },
    },
  };

  constructor(
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    public fb: FormBuilder,
    private personaService: PersonaService,
    private areaService: AreaService,
    private auth: authService,
    private rol: RolService
  ) {}
  listarRole(): void {
    this.subscripciones.push(
      this.rol.listar().subscribe((r) => {
        this.roles = r;
      })
    );
  }
  ngOnInit() {
    this.usuario = this.auth.getUserStorage();
    this.autoCompletadoArea();
    this.listarRole();
  }
  ngOnDestroy(): void {
    this.subscripciones.forEach((subs) => subs.unsubscribe());
  }

  autoCompletadoArea(): void {
    this.subscripciones.push(
      this.areaService.listar().subscribe(
        (resp) => {
          this.areas = resp;

          if (resp.length != 0) {
            this.construir(resp[0]);
          }
        },
        (error) => {
          console.error(error);
          this.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban las áreas" + error.error[0],

            0
          );
        }
      )
    );
  }
  reconstruir(area: any): void {
    this.subscripciones.push(
      this.personaService.listarPorArea(area.idArea).subscribe(
        (resp: any) => {
          this.sourceSmartUsuario.load(resp);
        },
        (error) => {
          console.error(error);
          this.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban los registros" + error.error[0],

            0
          );
        }
      )
    );
  }

  construir(area: any): void {
    this.subscripciones.push(
      this.personaService.listarPorArea(area.idArea).subscribe(
        (resp: any) => {
          this.sourceSmartUsuario.load(resp);
        },
        (error) => {
          console.error(error);
          this.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban los registros" + error.error[0],

            0
          );
        }
      )
    );
  }

  validarPersona(p) {
    let datosPersona = p.data;
    if (datosPersona.estado === true) {
      this.asignarPersona(datosPersona);
      this.stepper.next();
    } else {
      this.subscripciones.push(
        this.dialogService
          .open(DialogNamePromptComponent, {
            context: {
              titulo: "La persona seleccionada se encuentra desactivada",
              cuerpo: "¿Desea proseguir?",
            },
          })
          .onClose.subscribe((res) => {
            if (res) {
              this.stepper.next();
              this.asignarPersona(datosPersona);
            }
          })
      );
    }
  }
  asignarPersona(persona): void {
    persona.poseeUsuario = true;
    this.personaSeleccionada = persona;
    this.usuarioForm = this.fb.group({
      Correo: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(32),
          Validators.email,
        ]),
      ],
      uId: [""],
      Clave: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(128)]),
      ],
      Estado: [this.estado[0].Estado, Validators.required],
      Rol: ["", Validators.required],
      PersonaId: [persona.idPersona, Validators.required],
      usuarioCreacion: [this.usuario.uid, Validators.required],
      fechaCreacion: [this.fecha, Validators.required],
      usuarioModificacion: [this.usuario.uid, Validators.required],
      fechaModificacion: [this.fecha, Validators.required],
    });
  }

  async guardar() {
    try {
      const resultado = await this.auth.sigin(
        this.usuarioForm.value.Correo,
        this.usuarioForm.value.Clave
      );

      if (resultado) {
        this.usuarioForm.get("uId").setValue(resultado.user.uid);
        this.usuarioForm.get("Clave").reset();
        await this.colecciondeUsuario(resultado);
        this.sourceSmartUsuario.remove(this.personaSeleccionada);
        this.limpiar();
      }
    } catch (e) {
      console.error(e);

      this.showToast(
        "danger",
        "Error ",
        "Mientras se creaba la cuenta de usuario se detectó '" +
          this.errores(e.code) +
          "'",

        0
      );
    }
  }
  async colecciondeUsuario(resultado) {
    try {
      await this.auth.saveUserDB(this.usuarioForm.value, resultado.user.email);
      this.editarUsuario();
    } catch (error) {
      this.showToast(
        "danger",
        "Error " + error.code,
        "Mientras se registraban los datos del usuario " + error,

        0
      );
    }
  }
  private editarUsuario(): void {
    this.subscripciones.push(
      this.personaService
        .editar(this.personaSeleccionada.idPersona, this.personaSeleccionada)
        .subscribe(() => {
          this.showToast(
            "success",
            "Acción realizada",
            "Se ha ingresado el registro",
            4000
          );
        })
    );
  }

  hash256(clave): any {
    const utf8 = new TextEncoder().encode(clave);
    return crypto.subtle.digest("SHA-256", utf8).then((hashBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, "0"))
        .join("");
      return hashHex;
    });
  }
  limpiar(): void {
    this.personaSeleccionada = null;
    this.usuarioForm.get("Clave").reset();
    this.usuarioForm.get("Correo").reset();
    this.usuarioForm.get("PersonaId").reset();
    this.usuarioForm.get("uId").reset();
  }
  generarClave(): void {
    if (this.personaSeleccionada != null) {
      this.usuarioForm
        .get("Clave")
        .setValue(
          this.personaSeleccionada.pNombre[0] +
            this.personaSeleccionada.pApellido +
            Math.round(Math.random() * 10000)
        );
    }
  }

  private errores(code: any) {
    if (code === "auth/invalid-email") {
      return "Correo no válido";
    }
    if (code === "auth/email-already-in-use") {
      return "El correo ya se encuentra registrado";
    }
    if (code === "auth/weak-password") {
      return "La contraseña es muy débil";
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
