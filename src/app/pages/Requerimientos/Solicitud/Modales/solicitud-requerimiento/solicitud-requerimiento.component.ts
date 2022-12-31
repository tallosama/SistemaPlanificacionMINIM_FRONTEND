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
  selector: "ngx-solicitud-requerimiento",
  templateUrl: "./solicitud-requerimiento.component.html",
  styleUrls: ["./solicitud-requerimiento.component.scss"],
})
export class SolicitudRequerimientoComponent implements OnInit, OnDestroy {
  @Input() detalleEvento: any;
  fecha = new Date().toISOString().slice(0, 10);
  requerimientoForm: FormGroup;
  subscripciones: Array<Subscription> = [];
  tipos = ["Material", "Equipo", "Transporte"];
  keyword = "descripcion";
  data = [];
  nuevosRequerimientos = [];
  requerimientoSeleccionado: any = null;
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
    this.reiniciarForm();
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
  isModificacion = false;
  modificar(elemento): void {
    if (this.requerimientoSeleccionado == null) {
      this.isModificacion = true;
      this.requerimientoSeleccionado = elemento.data;
      this.smartRequerimientosAsignados.remove(this.requerimientoSeleccionado);
      this.smartRequerimientosAsignados.refresh();

      this.cargarDataForm();
    }
  }

  private cargarDataForm(): void {
    let user = this.auth.getUserStorage();
    this.requerimientoForm = this.fb.group({
      tipoRequerimiento: [
        this.requerimientoSeleccionado.tipoRequerimiento,
        Validators.compose([Validators.required, Validators.maxLength(32)]),
      ],
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
  editar(): void {
    if (this.requerimientoSeleccionado.idRequerimiento != null) {
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
              this.agregarATabla(r);
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
    } else {
      this.agregarATabla(this.requerimientoForm.value);
    }

    this.reiniciarForm();
    this.requerimientoSeleccionado = null;
    this.isModificacion = false;
  }

  reiniciarForm(): void {
    let user = this.auth.getUserStorage();
    this.requerimientoForm = this.fb.group({
      desRequerimiento: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(512)]),
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
      detalleEventoId: [this.detalleEvento, Validators.required],
      usuarioCreacion: [user.uid, Validators.required],
      fechaCreacion: [this.fecha, Validators.required],
      usuarioModificacion: [user.uid, Validators.required],
      fechaModificacion: [this.fecha, Validators.required],
    });
  }

  agregar(): void {
    this.agregarATabla(this.requerimientoForm.value);
    this.nuevosRequerimientos.push(this.requerimientoForm.value);
    this.reiniciarForm();
  }
  guardar(): void {
    this.nuevosRequerimientos.forEach((r) => {
      this.subscripciones.push(
        this.requerimientosService.guardar(r).subscribe(
          () => {
            Util.showToast(
              "success",
              "Acción realizada",
              "Se ha ingresado el registro",
              4000,
              this.toastrService
            );
          },
          (error) => {
            console.error(error);
            Util.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se realizaba un registro " + error.error[0],
              0,
              this.toastrService
            );
          }
        )
      );
    });
    this.nuevosRequerimientos = [];
  }
  public confirmacion(elemento): void {
    if (elemento.data.idRequerimiento == null) {
      this.smartRequerimientosAsignados.remove(elemento.data);

      this.smartRequerimientosAsignados.refresh();
      let indice = this.nuevosRequerimientos.indexOf(elemento.data);
      this.nuevosRequerimientos.splice(indice, 1);
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
    this.agregarATabla(elementoNuevo);
  }
  private agregarATabla(requerimiento): void {
    this.smartRequerimientosAsignados.add(requerimiento);
    this.smartRequerimientosAsignados.refresh();
  }

  cerrar() {
    this.ref.close();
  }
}
