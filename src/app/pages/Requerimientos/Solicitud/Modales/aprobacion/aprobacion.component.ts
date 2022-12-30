import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbDialogRef, NbDialogService, NbToastrService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { Subscription } from "rxjs-compat";
import { authService } from "../../../../../auth/auth.service";
import { ProductoService } from "../../../../Catalogos/Producto/producto.service";
import { VehiculoService } from "../../../../Catalogos/Vehiculo/vehiculo.service";
import { MensajeEntradaComponent } from "../../../../Globales/mensaje-entrada/mensaje-entrada.component";
import { Util } from "../../../../Globales/Util";
import { ShowcaseDialogComponent } from "../../../../modal-overlays/dialog/showcase-dialog/showcase-dialog.component";
import { RequerimientosService } from "../../../requerimientos.service";

@Component({
  selector: "ngx-aprobacion",
  templateUrl: "./aprobacion.component.html",
  styleUrls: ["./aprobacion.component.scss"],
})
export class AprobacionComponent implements OnInit, OnDestroy {
  @Input() detalleEvento: any;
  fecha = new Date().toISOString().slice(0, 10);
  requerimientoForm: FormGroup;
  subscripciones: Array<Subscription> = [];
  estado = ["Rechazado", "Aprobado"];
  data = [];
  requerimientoSeleccionado: any;
  smartRequerimientosAsignados: LocalDataSource = new LocalDataSource();
  settingsRequerimientos = {
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
      desRequerimiento: {
        title: "Descripción",
        type: "string",
      },
      tipoRequerimiento: {
        title: "Tipo de requerimiento",
        type: "string",
      },
      cantidadSolicitada: {
        title: "Cantidad solicitada",
        type: "number",
      },
      cantidadAprobada: {
        title: "Cantidad aprobada",
        type: "number",
      },
      estado: {
        title: "Estado de requerimiento",
        type: "string",
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

  constructor(
    protected ref: NbDialogRef<ShowcaseDialogComponent>,
    private toastrService: NbToastrService,
    public fb: FormBuilder,
    private auth: authService,
    private dialogService: NbDialogService,
    private requerimientosService: RequerimientosService,
    private productoService: ProductoService,
    private vehiculoService: VehiculoService
  ) {}

  ngOnInit(): void {
    this.cargarForm();
    this.llenadoTablaRequerimientos();
  }
  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe());
  }
  private llenadoTablaRequerimientos(): void {
    this.subscripciones.push(
      this.requerimientosService
        .listarPorDetalle(this.detalleEvento.idDetalleEvento)
        .subscribe(
          (resp) => {
            this.smartRequerimientosAsignados.load(resp);
            this.smartRequerimientosAsignados.refresh();
          },
          (error) => {
            console.error(error);
            Util.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se listaban los requerimientos " + error.error[0],

              0,
              this.toastrService
            );
          }
        )
    );
  }

  cargarForm(): void {
    let user = this.auth.getUserStorage();
    this.requerimientoForm = this.fb.group({
      desRequerimiento: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(512),
          Util.noObjeto,
        ]),
      ],
      cantidadSolicitada: ["0", Validators.required],
      cantidadAprobada: ["0", Validators.required],
      tipoRequerimiento: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(32)]),
      ],
      estado: [
        "Solicitado",
        Validators.compose([Validators.required, Validators.maxLength(32)]),
      ],
      anulacion: [false, Validators.required],
      motivoAnulacion: [""],
      detalleEventoId: ["", Validators.required],
      usuarioCreacion: [user.uid, Validators.required],
      fechaCreacion: [this.fecha, Validators.required],
      usuarioModificacion: [user.uid, Validators.required],
      fechaModificacion: [this.fecha, Validators.required],
    });
    if (this.requerimientoSeleccionado != null) {
      this.smartRequerimientosAsignados.add(this.requerimientoSeleccionado);
      this.smartRequerimientosAsignados.refresh();
      this.requerimientoSeleccionado = null;
    }
  }
  aprobacion(elemento): void {
    if (this.requerimientoSeleccionado == null) {
      this.requerimientoSeleccionado = elemento.data;
      this.smartRequerimientosAsignados.remove(this.requerimientoSeleccionado);
      this.smartRequerimientosAsignados.refresh();

      this.cargarDataForm();
    }
  }
  private cargarDataForm(): void {
    let user = this.auth.getUserStorage();
    this.requerimientoForm = this.fb.group({
      desRequerimiento: [
        this.requerimientoSeleccionado.desRequerimiento,
        Validators.compose([Validators.required, Validators.maxLength(512)]),
      ],
      cantidadSolicitada: [
        this.requerimientoSeleccionado.cantidadSolicitada,
        Validators.required,
      ],
      cantidadAprobada: [
        this.requerimientoSeleccionado.cantidadAprobada,
        Validators.required,
      ],
      tipoRequerimiento: [
        this.requerimientoSeleccionado.tipoRequerimiento,
        Validators.compose([Validators.required, Validators.maxLength(32)]),
      ],
      estado: [
        this.requerimientoSeleccionado.estado,
        Validators.compose([Validators.required, Validators.maxLength(32)]),
      ],
      anulacion: [
        this.requerimientoSeleccionado.anulacion,
        Validators.required,
      ],
      motivoAnulacion: [this.requerimientoSeleccionado.motivoAnulacion],
      detalleEventoId: [
        this.requerimientoSeleccionado.detalleEventoId,
        Validators.required,
      ],
      usuarioCreacion: [user.uid, Validators.required],
      fechaCreacion: [this.fecha, Validators.required],
      usuarioModificacion: [user.uid, Validators.required],
      fechaModificacion: [this.fecha, Validators.required],
    });
  }
  guardar(): void {
    this.subscripciones.push(
      this.requerimientosService
        .editar(
          this.requerimientoSeleccionado.idRequerimiento,
          this.requerimientoForm.value
        )
        .subscribe(
          (r) => {
            Util.showToast(
              "success",
              "Acción realizada",
              "Se ha modificado el registro",
              4000,
              this.toastrService
            );
            this.requerimientoSeleccionado = r;

            this.cargarForm();
          },
          (error) => {
            console.error(error);
            Util.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se realizaba la tarea " + error.error[0],
              0,
              this.toastrService
            );
          }
        )
    );
  }
  public confirmacion(elemento): void {
    if (elemento.data.idRequerimiento == null) {
      this.smartRequerimientosAsignados.remove(elemento.data);

      this.smartRequerimientosAsignados.refresh();
    } else {
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
  }

  private anular(elemento: any, motivoAnulacion: string): void {
    this.subscripciones.push(
      this.requerimientosService
        .anular(elemento.idRequerimiento, motivoAnulacion)
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
    this.smartRequerimientosAsignados.remove(elementoAnterior);
    this.smartRequerimientosAsignados.add(elementoNuevo);
    this.smartRequerimientosAsignados.refresh();
  }
  cerrar() {
    this.ref.close();
  }
}
