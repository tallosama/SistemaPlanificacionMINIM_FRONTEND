import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  NbDialogService,
  NbGlobalPhysicalPosition,
  NbStepperComponent,
  NbToastrService,
} from "@nebular/theme";
import { DataTableDirective } from "angular-datatables";
import { Observable, Subject, Subscription } from "rxjs";
import { authService } from "../../../../../auth/auth.service";
import { AreaService } from "../../../../Catalogos/Area/area.service";
import { PersonaService } from "../../../../Catalogos/Persona/persona.service";
import { DialogNamePromptComponent } from "../../../../modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component";

@Component({
  selector: "ngx-crear-usuario",
  templateUrl: "./crear-usuario.component.html",
  styleUrls: ["./crear-usuario.component.scss"],
})
export class CrearUsuarioComponent implements OnInit, OnDestroy {
  @ViewChild(NbStepperComponent) stepper: NbStepperComponent;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  subscripciones: Array<Subscription> = [];
  data: any;
  //autocompletado
  keyword = "desArea";
  //areas$: Observable<any>;
  areas: any = [];
  usuarioForm: FormGroup;
  personaSeleccionada: any;

  fecha = new Date().toISOString().slice(0, 10);
  usuario = 1;
  roles = ["Admin", "ASustantivas"];
  estado = [
    { Estado: true, Descripcion: "Activo" },
    { Estado: false, Descripcion: "Inactivo" },
  ];

  constructor(
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    public fb: FormBuilder,
    private personaService: PersonaService,
    private areaService: AreaService,
    private auth: authService
  ) {}

  ngOnInit(): void {
    this.autoCompletadoArea();

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      destroy: true,

      language: {
        url: "//cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json",
      },
    };
  }
  ngOnDestroy(): void {
    this.subscripciones.forEach((subs) => subs.unsubscribe());
    this.dtTrigger.unsubscribe();
  }

  autoCompletadoArea(): void {
    this.subscripciones.push(
      this.areaService.listar().subscribe(
        (resp) => {
          this.areas = resp;

          if (resp.length != 0) {
            this.construir(resp[0]);
          } else this.dtTrigger.next();
        },
        (error) => {
          console.error(error);
          this.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban categorías " + error.message,
            0
          );
        }
      )
    );
  }
  reconstruir(area: any): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.subscripciones.push(
        this.personaService.listarPorArea(area.idArea).subscribe(
          (resp: any) => {
            this.data = resp;
            this.dtTrigger.next();
          },
          (error) => {
            console.error(error);
            this.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se listaban los registros" + error.message,
              0
            );
          }
        )
      );
    });
  }

  construir(area: any): void {
    this.subscripciones.push(
      this.personaService.listarPorArea(area.idArea).subscribe(
        (resp: any) => {
          this.data = resp;
          this.dtTrigger.next();
        },
        (error) => {
          console.error(error);
          this.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban los registros" + error.message,
            0
          );
        }
      )
    );
  }

  validarPersona(p) {
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
          this.asignarPersona(p);
        }
      });
  }
  asignarPersona(persona): void {
    persona.poseeUsuario = true;
    this.personaSeleccionada = persona;
    this.usuarioForm = this.fb.group({
      Correo: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(32)]),
      ],
      uId: [""],
      Clave: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(128)]),
      ],
      Estado: ["", Validators.required],
      Rol: ["", Validators.required],
      PersonaId: [persona.idPersona, Validators.required],
      usuarioCreacion: [this.usuario, Validators.required],
      fechaCreacion: [this.fecha, Validators.required],
      usuarioModificacion: [this.usuario, Validators.required],
      fechaModificacion: [this.fecha, Validators.required],
    });
  }

  async guardar() {
    const resultado = await this.auth
      .sigin(this.usuarioForm.value)
      .catch((error) =>
        this.showToast(
          "danger",
          "Error " + error.status,
          "Mientras se registraba un usuario " + error,
          0
        )
      );
    if (resultado) {
      this.usuarioForm.get("Clave").setValue(null);
      this.usuarioForm.get("uId").setValue(resultado.user.uid);
      await this.auth
        .coleccionUsuario(this.usuarioForm.value, "Usuario", resultado.user.uid)
        .then((r) => {
          this.subscripciones.push(
            this.personaService
              .editar(
                this.personaSeleccionada.idPersona,
                this.personaSeleccionada
              )
              .subscribe((r) => {
                this.showToast(
                  "success",
                  "Acción realizada",
                  "Se ha ingresado el registro",
                  4000
                );
              })
          );
        })
        .catch((error) =>
          this.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se ingresaban los datos de usuario " + error,
            0
          )
        );
    }
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
