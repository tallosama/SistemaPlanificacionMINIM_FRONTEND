import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  NbDialogService,
  NbGlobalPhysicalPosition,
  NbStepperComponent,
  NbToastrService,
} from "@nebular/theme";
import { DataTableDirective } from "angular-datatables";
import { LocalDataSource } from "ng2-smart-table";
import { Observable, Subject, Subscription } from "rxjs";
import { authService } from "../../../../../auth/auth.service";
import { AreaService } from "../../../../Catalogos/Area/area.service";
import { PersonaService } from "../../../../Catalogos/Persona/persona.service";
import { RolService } from "../../../../Catalogos/Rol/rol.service";
import { Control } from "../../../../Globales/Control";
import { DialogNamePromptComponent } from "../../../../modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component";

@Component({
  selector: "ngx-crear-usuario",
  templateUrl: "./crear-usuario.component.html",
  styleUrls: ["./crear-usuario.component.scss"],
})
export class CrearUsuarioComponent implements OnInit, OnDestroy {
  @ViewChild(NbStepperComponent) stepper: NbStepperComponent;
  // @ViewChild(DataTableDirective, { static: false })
  // dtElement: DataTableDirective;
  // dtOptions: DataTables.Settings = {};
  // dtTrigger = new Subject();
  subscripciones: Array<Subscription> = [];
  // data: any;
  //autocompletado
  keyword = "desArea";
  public historyHeading: string = "Recientes";
  //areas$: Observable<any>;
  roles: any;
  areas: any = [];
  usuarioForm: FormGroup;
  personaSeleccionada: any;
  usuario: any;
  fecha = new Date().toISOString().slice(0, 10);
  //["Admin", "ASustantivas"];
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
    this.rol.listar().subscribe((r) => {
      this.roles = r;
    });
  }
  ngOnInit(): void {
    this.usuario = this.auth.getUserStorage();
    this.autoCompletadoArea();
    this.listarRole();
    // this.dtOptions = {
    //   pagingType: "full_numbers",
    //   pageLength: 10,
    //   destroy: true,

    //   language: {
    //     url: "//cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json",
    //   },
    // };
  }
  ngOnDestroy(): void {
    this.subscripciones.forEach((subs) => subs.unsubscribe());
    // this.dtTrigger.unsubscribe();
  }

  autoCompletadoArea(): void {
    this.subscripciones.push(
      this.areaService.listar().subscribe(
        (resp) => {
          this.areas = resp;

          if (resp.length != 0) {
            this.construir(resp[0]);
          }
          //else this.dtTrigger.next();
        },
        (error) => {
          console.error(error);
          this.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban las áreas" +
              Control.evaluarErrorDependiente(error.error),

            0
          );
        }
      )
    );
  }
  reconstruir(area: any): void {
    //this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //dtInstance.destroy();
    this.subscripciones.push(
      this.personaService.listarPorArea(area.idArea).subscribe(
        (resp: any) => {
          //   this.data = resp;
          this.sourceSmartUsuario.load(resp);
          // this.dtTrigger.next();
        },
        (error) => {
          console.error(error);
          this.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban los registros" +
              Control.evaluarErrorDependiente(error.error),

            0
          );
        }
      )
      // );}
    );
  }

  construir(area: any): void {
    this.subscripciones.push(
      this.personaService.listarPorArea(area.idArea).subscribe(
        (resp: any) => {
          //this.data = resp;
          this.sourceSmartUsuario.load(resp);
          //   this.dtTrigger.next();
        },
        (error) => {
          console.error(error);
          this.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban los registros" +
              Control.evaluarErrorDependiente(error.error),

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
        });
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
    //  this.hash256(this.usuarioForm.value.Clave).then(async (clave) => {
    const resultado = await this.auth
      .sigin(this.usuarioForm.value.Correo, this.usuarioForm.value.Clave)
      .catch((error) =>
        this.showToast(
          "danger",
          "Error " + error.status,
          "Mientras se creaba la cuenta de usuario" +
            Control.evaluarErrorRepetido(error.error),

          0
        )
      );
    if (resultado) {
      this.usuarioForm.get("uId").setValue(resultado.user.uid);
      //this.usuarioForm.get("Clave").setValue(clave);
      this.usuarioForm.get("Clave").reset();
      await this.colecciondeUsuario(resultado);
      this.sourceSmartUsuario.remove(this.personaSeleccionada);
      //  this.actualizarTabla(this.personaSeleccionada);
      this.limpiar();
    }
    // });
  }
  async colecciondeUsuario(resultado) {
    await this.auth
      .coleccionUsuario(this.usuarioForm.value, "Usuario", resultado.user.uid)
      .then((res) => {
        this.editarUsuario();
      })
      .catch((error) => {
        this.showToast(
          "danger",
          "Error " + error.status,
          "Mientras se registraban los datos del usuario" +
            Control.evaluarErrorRepetido(error.error),

          0
        );
      });
  }
  private editarUsuario(): void {
    this.subscripciones.push(
      this.personaService
        .editar(this.personaSeleccionada.idPersona, this.personaSeleccionada)
        .subscribe((r) => {
          this.showToast(
            "success",
            "Acción realizada",
            "Se ha ingresado el registro",
            4000
          );
        })
    );
  }

  // actualizarTabla(id: any): void {
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     // Primero destruimos la instancia de la datatable
  //     dtInstance.destroy();
  //     //Obtenemos el índice del elemento a eliminar y lo eliminamos de this.data
  //     this.data.splice(this.data.indexOf(id), 1); // 1 es la cantidad de elemento a eliminar
  //     //reconstrucción de la datatables con los nevos elementos
  //     this.dtTrigger.next();
  //   });
  // }
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
    // this.usuarioForm.get("Estado").reset();
    // this.usuarioForm.get("Rol").reset();
    this.usuarioForm.get("PersonaId").reset();
    this.usuarioForm.get("uId").reset();
  }
  generarClave(): void {
    this.usuarioForm
      .get("Clave")
      .setValue(
        this.personaSeleccionada.pNombre[0] +
          this.personaSeleccionada.pApellido +
          Math.round(Math.random() * 10000)
      );
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
