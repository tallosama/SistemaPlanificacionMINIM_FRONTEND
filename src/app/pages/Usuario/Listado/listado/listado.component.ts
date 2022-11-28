import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NbDialogService,
  NbGlobalPhysicalPosition,
  NbToastrService,
} from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { Subscription } from "rxjs";
import { authService } from "../../../../auth/auth.service";
import { AreaService } from "../../../Catalogos/Area/area.service";
import { PersonaService } from "../../../Catalogos/Persona/persona.service";
import { RolService } from "../../../Catalogos/Rol/rol.service";
import { DialogNamePromptComponent } from "../../../modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component";

@Component({
  selector: "ngx-listado",
  templateUrl: "./listado.component.html",
  styleUrls: ["./listado.component.scss"],
})
export class ListadoComponent implements OnInit, OnDestroy {
  subscripciones: Array<Subscription> = [];

  usuario: any;
  fecha = new Date().toISOString().slice(0, 10);
  sourceSmartUsuario: LocalDataSource = new LocalDataSource();
  settings = {
    mode: "external",

    edit: {
      editButtonContent: '<i class="nb-locked"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-close-circled"></i>',
    },
    actions: {
      columnTitle: "Acción",
      add: false,
    },

    pager: {
      display: true,
      perPage: 5,
    },
    columns: {
      Correo: {
        title: "Correo",
        type: "string",
      },
      Rol: {
        title: "Rol",
        type: "string",
      },
      Estado: {
        title: "Estado",
        valuePrepareFunction: (data) => {
          return data ? "Activo" : "Inactivo";
        },
      },
    },
  };
  public mensaje() {
    console.log("mensaje");
  }
  constructor(
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private auth: authService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.usuario = this.auth.getUserStorage();
    this.contruirTabla();
  }
  ngOnDestroy(): void {
    this.subscripciones.forEach((subs) => subs.unsubscribe());
  }
  private contruirTabla(): void {
    this.subscripciones.push(
      this.auth.getUsersDB().subscribe((u) => {
        u.forEach((e) => {
          this.sourceSmartUsuario.add(e.data());
        }),
          this.sourceSmartUsuario.refresh();
      })
    );
  }
  confirmacion(id): void {
    let mensaje: string;
    let activar: boolean = false;
    if (id.data.Estado) {
      mensaje = "¿Desea desactivar el usuario?";
    } else {
      mensaje = "¿Desea activar al usuario?";
      activar = true;
    }
    this.subscripciones.push(
      this.dialogService
        .open(DialogNamePromptComponent, {
          context: {
            cuerpo: mensaje,
          },
        })
        .onClose.subscribe((res) => {
          if (res) {
            this.accion(id.data, activar);
          }
        })
    );
  }
  async accion(data, activar: boolean) {
    data.Estado = activar;
    await this.auth
      .updateUserDB(data.uId, data)
      .then(() => {
        this.showToast(
          "success",
          "Acción realizada",
          activar
            ? "Se ha activado el usuario"
            : "Se ha desactivado el usuario",
          4000
        );
      })
      .catch((error) => {
        this.showToast(
          "danger",
          "Error " + error.status,
          activar
            ? "Al activar al usuario "
            : "Al desactivar al usuario " + error,

          0
        );
      });
    this.sourceSmartUsuario.refresh();
  }
  async sendRequest(event) {
    this.subscripciones.push(
      this.dialogService
        .open(DialogNamePromptComponent, {
          context: {
            titulo: "Reestablecimiento de clave",
            cuerpo:
              "¿Desea enviar una solicitud de reestablecimiento al correo " +
              event.data.Correo +
              "?",
          },
        })
        .onClose.subscribe(async (res) => {
          if (res) {
            await this.auth
              .request(event.data.Correo)
              .then(() =>
                this.showToast(
                  "primary",
                  "Acción realizada",
                  "Se ha enviado una solicitud al correo de destino, si no aparece, verifique en el apartado de spam",
                  10000
                )
              )
              .catch((error) => {
                this.showToast(
                  "danger",
                  "Error " + error.status,
                  "Al enviar una solicitud de reestablecimiento de clave " +
                    error,

                  0
                );
              });
          }
        })
    );

    // this.router.navigate(["../EditarUsuario", event.data.uId], {
    //   relativeTo: this.route,
    // });
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
