import { Component, OnInit, OnDestroy } from "@angular/core";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { Subscription } from "rxjs";
import { PersonaService } from "../../persona.service";
import { DialogNamePromptComponent } from "../../../../modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component";
import { LocalDataSource } from "ng2-smart-table";
import { ActivatedRoute, Router } from "@angular/router";
import { Util } from "../../../../Globales/Util";
import { authService } from "../../../../../auth/auth.service";
import { MensajeEntradaComponent } from "../../../../Globales/mensaje-entrada/mensaje-entrada.component";

@Component({
  selector: "ngx-listado",
  templateUrl: "./listado.component.html",
  styleUrls: ["./listado.component.scss"],
})
export class ListadoComponent implements OnInit, OnDestroy {
  // @ViewChild(DataTableDirective, { static: false })
  // dtElement: DataTableDirective;
  // dtOptions: DataTables.Settings = {};
  // dtTrigger = new Subject();

  sourceSmart: LocalDataSource = new LocalDataSource();
  settings = {
    mode: "external",

    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-alert"></i>',
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
      cargoId: {
        title: "Cargo",
        valuePrepareFunction: (data) => {
          return data.desCargo;
        },
      },

      anulacion: {
        title: "Estado",
        valuePrepareFunction: (data) => {
          return data ? "Anulado" : "Activo";
        },
      },

      motivoAnulacion: {
        title: "Motivo",
        type: "string",
      },
    },
  };

  subscripciones: Array<Subscription> = [];
  //data: any;
  constructor(
    private personaService: PersonaService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: authService
  ) {}

  construir(): void {
    this.subscripciones.push(
      this.personaService.listar().subscribe(
        (resp: any) => {
          this.sourceSmart.load(resp);
          // this.data = resp;
          // this.dtTrigger.next();
        },
        (error) => {
          console.error(error);
          Util.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban los registros" + error.error[0],

            0,
            this.toastrService
          );
        }
      )
    );
  }

  reconstruir(elementoAnterior: any, elementoNuevo: any): void {
    this.sourceSmart.remove(elementoAnterior);
    this.sourceSmart.add(elementoNuevo);
    this.sourceSmart.refresh();
  }

  ngOnInit(): void {
    this.construir();
    //datatables
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

  confirmacion(elemento): void {
    let mensaje: string = elemento.data.anulacion
      ? "¿Desea reactivar el registro?"
      : "¿Desea anular el registro?";

    this.subscripciones.push(
      this.dialogService
        .open(MensajeEntradaComponent, {
          context: {
            titulo: mensaje,
          },
        })
        .onClose.subscribe((res) => {
          if (res) {
            this.anular(
              elemento.data,
              "'" +
                res +
                "', por " +
                this.auth.getUserStorage().email +
                " el " +
                new Date().toLocaleString()
            );
          }
        })
    );

    // if (!id.data.poseeUsuario) {

    //   this.subscripciones.push(
    //     this.dialogService
    //       .open(DialogNamePromptComponent, {
    //         context: {
    //           cuerpo: "¿Desea eliminar el registro?",
    //         },
    //       })
    //       .onClose.subscribe((res) => {
    //         if (res) {
    //           this.eliminar(id.data);
    //         }
    //       })
    //   );
    // } else {
    //   Util.showToast(
    //     "warning",
    //     "Atención",
    //     "No se puede eliminar el personal seleccionado debido que posee una cuenta de usuario",
    //     4000,
    //     this.toastrService
    //   );
    // }
  }

  anular(elemento: any, motivoAnulacion: string): void {
    this.subscripciones.push(
      this.personaService.anular(elemento.idPersona, motivoAnulacion).subscribe(
        (res) => {
          let mensaje: string = res.anulacion
            ? "Se ha anulado el registro"
            : "Se ha reactivado el registro";

          Util.showToast(
            "success",
            "Acción realizada",
            mensaje,
            4000,
            this.toastrService
          );

          this.reconstruir(elemento, res);
        },
        (error) => {
          console.error(error);
          Util.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se anulaba el registro" + error.error[0],
            0,
            this.toastrService
          );
        }
      )
    );
  }

  editarRegistro(event) {
    this.router.navigate(["../EditarPersona", event.data.idPersona], {
      relativeTo: this.route,
    });
  }
}
