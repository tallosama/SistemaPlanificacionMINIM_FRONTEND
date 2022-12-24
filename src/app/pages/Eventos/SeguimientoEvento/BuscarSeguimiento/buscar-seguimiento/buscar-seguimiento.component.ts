import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbDialogRef, NbDialogService, NbToastrService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { Subscription } from "rxjs";
import { authService } from "../../../../../auth/auth.service";
import { MensajeEntradaComponent } from "../../../../Globales/mensaje-entrada/mensaje-entrada.component";
import { Util } from "../../../../Globales/Util";
import { ShowcaseDialogComponent } from "../../../../modal-overlays/dialog/showcase-dialog/showcase-dialog.component";
import { DetalleEventoService } from "../../../detalle-evento.service";
import { SeguimientoEventoService } from "../../../seguimiento-evento/seguimiento-evento.service";
import { RenderSeguimientoMunicipioComponent } from "../Renders/render-seguimiento-municipio/render-seguimiento-municipio.component";
import { RenderSeguimientoComponent } from "../Renders/render-seguimiento/render-seguimiento.component";

@Component({
  selector: "ngx-buscar-seguimiento",
  templateUrl: "./buscar-seguimiento.component.html",
  styleUrls: ["./buscar-seguimiento.component.scss"],
})
export class BuscarSeguimientoComponent implements OnInit, OnDestroy {
  @Input() eventoId: any;
  fecha = new Date().toISOString().slice(0, 10);
  asignacionForm: FormGroup;
  subscripciones: Array<Subscription> = [];
  seguimientoSeleccionado: any = null;
  smartSeguimiento: LocalDataSource = new LocalDataSource();

  settingsSeguimiento = {
    mode: "external",

    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-alert"></i>',
    },
    actions: {
      columnTitle: "Acciones",
      add: false,
    },
    pager: {
      display: true,
      perPage: 5,
    },
    columns: {
      Municipio: {
        title: "Municipio del evento",
        type: "custom",
        renderComponent: RenderSeguimientoMunicipioComponent,
      },
      detalleEventoId: {
        title: "Fecha del evento",
        valuePrepareFunction: (data) => {
          return data.fecha;
        },
      },

      hora: {
        title: "Hora del evento",
        type: "custom",
        renderComponent: RenderSeguimientoComponent,
      },
      resultados: {
        title: "Resultados",
        type: "string",
      },
      incidencias: {
        title: "Incidencias",
        type: "string",
      },
      participantesReal: {
        title: "Total",
        type: "number",
      },
      cantMujeres: {
        title: "Mujeres",
        type: "number",
      },
      cantVarones: {
        title: "Hombres",
        type: "number",
      },
      anulacion: {
        title: "Estado",
        type: "string",
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

  constructor(
    protected ref: NbDialogRef<ShowcaseDialogComponent>,
    public fb: FormBuilder,
    private toastrService: NbToastrService,
    private auth: authService,
    private seguimientoService: SeguimientoEventoService,
    private detalleEventoService: DetalleEventoService,
    private dialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    this.formVacio();
    this.cargarDetalles();
  }
  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe());
  }

  private cargarDetalles(): void {
    this.subscripciones.push(
      this.seguimientoService.listarPorEvento(this.eventoId.idEvento).subscribe(
        (resp) => {
          this.smartSeguimiento.load(resp);
          this.smartSeguimiento.refresh();
        },
        (error) => {
          console.error(error);
          Util.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban los planes" + error.error[0],

            0,
            this.toastrService
          );
        }
      )
    );
  }

  cargarForm(elemento): void {
    if (this.seguimientoSeleccionado == null) {
      this.seguimientoSeleccionado = elemento.data;
      this.smartSeguimiento.remove(this.seguimientoSeleccionado);
      this.smartSeguimiento.refresh();
      let user = this.auth.getUserStorage();
      this.asignacionForm = this.fb.group({
        resultados: [
          this.seguimientoSeleccionado.resultados,
          Validators.maxLength(1024),
        ],

        incidencias: [
          this.seguimientoSeleccionado.incidencias,
          Validators.maxLength(1024),
        ],

        participantesReal: [
          this.seguimientoSeleccionado.participantesReal,
          Validators.required,
        ],

        cantMujeres: [
          this.seguimientoSeleccionado.cantMujeres,
          Validators.required,
        ],

        cantVarones: [
          this.seguimientoSeleccionado.cantVarones,
          Validators.required,
        ],

        anulacion: [
          this.seguimientoSeleccionado.anulacion,
          Validators.required,
        ],
        motivoAnulacion: [this.seguimientoSeleccionado.motivoAnulacion],

        detalleEventoId: [
          this.seguimientoSeleccionado.detalleEventoId,
          Validators.required,
        ],

        usuarioCreacion: [user.uid, Validators.required],
        fechaCreacion: [this.fecha, Validators.required],
        usuarioModificacion: [user.uid, Validators.required],
        fechaModificacion: [this.fecha, Validators.required],
      });
    }
  }
  private formVacio(): void {
    let user = this.auth.getUserStorage();
    this.seguimientoSeleccionado = null;
    this.asignacionForm = this.fb.group({
      resultados: ["", Validators.maxLength(1024)],

      incidencias: ["", Validators.maxLength(1024)],

      participantesReal: [0, Validators.required],

      cantMujeres: [0, Validators.required],

      cantVarones: [0, Validators.required],

      anulacion: ["", Validators.required],
      motivoAnulacion: [""],

      detalleEventoId: ["", Validators.required],

      usuarioCreacion: [user.uid, Validators.required],
      fechaCreacion: [this.fecha, Validators.required],
      usuarioModificacion: [user.uid, Validators.required],
      fechaModificacion: [this.fecha, Validators.required],
    });
  }

  public actualizarTotal(): void {
    let valorMujeres = this.asignacionForm.get("cantMujeres").value * 1;
    let valorHombres = this.asignacionForm.get("cantVarones").value * 1;
    this.asignacionForm
      .get("participantesReal")
      .setValue(valorMujeres + valorHombres);
  }
  editar() {
    this.subscripciones.push(
      this.seguimientoService
        .editar(
          this.seguimientoSeleccionado.idSeguimientoEvento,
          Util.limpiarForm(this.asignacionForm.value)
        )
        .subscribe(
          (resp) => {
            Util.showToast(
              "success",
              "Acción realizada",
              "Se ha modificado el registro",
              4000,
              this.toastrService
            );
            this.smartSeguimiento.add(resp);
            this.smartSeguimiento.refresh();
            this.formVacio();
          },
          (error) => {
            console.error(error);
            Util.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se modificaba un registro" + error.error[0],
              0,
              this.toastrService
            );
          }
        )
    );
  }
  public cerrar(): void {
    this.ref.close();
  }
  public cancelar(): void {
    this.smartSeguimiento.add(this.seguimientoSeleccionado);
    this.smartSeguimiento.refresh();
    this.formVacio();
  }
  public confirmacion(elemento): void {
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
  }

  private anular(elemento: any, motivoAnulacion: string): void {
    this.subscripciones.push(
      this.seguimientoService
        .anular(elemento.idSeguimientoEvento, motivoAnulacion)
        .subscribe(
          (res) => {
            let anulacion = res.anulacion;
            let mensaje: string = anulacion
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
            this.cambiarEstadoAlDetalle(elemento, anulacion);
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
  reconstruir(elementoAnterior: any, elementoNuevo: any): void {
    this.smartSeguimiento.remove(elementoAnterior);
    this.smartSeguimiento.add(elementoNuevo);
    this.smartSeguimiento.refresh();
  }
  private cambiarEstadoAlDetalle(elemento, anulacion: boolean): void {
    let detalleEvento = elemento.detalleEventoId;
    let estado: string = "Realizada";
    if (anulacion) {
      estado = "Pendiente";
    }
    this.subscripciones.push(
      this.detalleEventoService
        .cambiarEstado(detalleEvento.idDetalleEvento, estado)
        .subscribe(
          () => {
            Util.showToast(
              "success",
              "Acción realizada",
              "Se ha cambiado el estado al detalle de evento ",
              4000,
              this.toastrService
            );
          },
          (error) => {
            console.error(error);
            Util.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se cambiaba el estado al detalle de evento " +
                error.error[0],
              0,
              this.toastrService
            );
          }
        )
    );
  }

  // private cambiarEstadoAlDetalle(elemento, anulacion: boolean): void {
  //   let detalleEvento = elemento.detalleEventoId;
  //   if (anulacion) detalleEvento["estado"] = "Pendiente";
  //   else {
  //     detalleEvento["estado"] = "Realizada";
  //   }
  //   this.subscripciones.push(
  //     this.detalleEventoService
  //       .editar(detalleEvento.idDetalleEvento, detalleEvento)
  //       .subscribe(
  //         () => {
  //           Util.showToast(
  //             "success",
  //             "Acción realizada",
  //             "Se ha cambiado el estado al detalle de evento ",
  //             4000,
  //             this.toastrService
  //           );
  //         },
  //         (error) => {
  //           console.error(error);
  //           Util.showToast(
  //             "danger",
  //             "Error " + error.status,
  //             "Mientras se cambiaba el estado al detalle de evento " +
  //               error.error[0],
  //             0,
  //             this.toastrService
  //           );
  //         }
  //       )
  //   );
  // }
}
