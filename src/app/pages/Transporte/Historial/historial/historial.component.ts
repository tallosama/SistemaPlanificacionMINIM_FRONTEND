import { Component, OnDestroy, OnInit } from "@angular/core";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { Subscription } from "rxjs-compat";
import { authService } from "../../../../auth/auth.service";
import { VehiculoService } from "../../../Catalogos/Vehiculo/vehiculo.service";
import { MensajeEntradaComponent } from "../../../Globales/mensaje-entrada/mensaje-entrada.component";
import { Util } from "../../../Globales/Util";
import { RequerimientosService } from "../../../Requerimientos/requerimientos.service";
import { TransporteService } from "../../transporte.service";
import { RenderDescripcionRequerimientoComponent } from "./Renders/render-descripcion-requerimiento/render-descripcion-requerimiento.component";
import { RenderRequerimientoEventoComponent } from "./Renders/render-requerimiento-evento/render-requerimiento-evento.component";
import { RenderRequerimientoFechaComponent } from "./Renders/render-requerimiento-fecha/render-requerimiento-fecha.component";
import { RenderRequerimientoHoraComponent } from "./Renders/render-requerimiento-hora/render-requerimiento-hora.component";
import { RenderVehiculoMarcaComponent } from "./Renders/render-vehiculo-marca/render-vehiculo-marca.component";
import { RenderVehiculoPlacaComponent } from "./Renders/render-vehiculo-placa/render-vehiculo-placa.component";

@Component({
  selector: "ngx-historial",
  templateUrl: "./historial.component.html",
  styleUrls: ["./historial.component.scss"],
})
export class HistorialComponent implements OnInit, OnDestroy {
  subscripciones: Array<Subscription> = [];
  smartTransporte: LocalDataSource = new LocalDataSource();
  settingsTransporte = {
    mode: "external",

    delete: {
      deleteButtonContent: '<i class="nb-alert"></i>',
    },
    actions: {
      columnTitle: "Acción",
      add: false,
      edit: false,
    },

    pager: {
      display: true,
      perPage: 5,
    },
    columns: {
      eventoRequerimientoId: {
        title: "Evento",
        type: "custom",
        renderComponent: RenderRequerimientoEventoComponent,
      },
      requerimientoId: {
        title: "Lugar",
        valuePrepareFunction: (data) => {
          return data.detalleEventoId.municipioId.desMunicipio;
        },
      },
      FechaRequerimientoId: {
        title: "Fecha del evento",
        type: "custom",
        renderComponent: RenderRequerimientoFechaComponent,
      },
      horaRequerimientoId: {
        title: "Hora del evento",
        type: "custom",
        renderComponent: RenderRequerimientoHoraComponent,
      },
      descripcionRequerimiento: {
        title: "Descripción de la solicitud",
        type: "custom",
        renderComponent: RenderDescripcionRequerimientoComponent,
      },

      vehiculoId: {
        title: "Descripción del vehículo asignado",
        valuePrepareFunction: (data) => {
          return data.desVehiculo;
        },
      },

      placaVehiculoId: {
        title: "Placa",
        type: "custom",
        renderComponent: RenderVehiculoPlacaComponent,
      },

      marcaVehiculoId: {
        title: "Marca",
        type: "custom",
        renderComponent: RenderVehiculoMarcaComponent,
      },

      anulacion: {
        title: "Estado",
        valuePrepareFunction: (data) => {
          return data ? "Anulado" : "Activo";
        },
      },
      motivoAnulacion: {
        title: "Motivo de anulación",
        type: "string",
      },
    },
  };

  fechaInicio: string = new Date().toISOString().slice(0, 10);
  fechaFin: string = new Date().toISOString().slice(0, 10);

  constructor(
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private requerimientosService: RequerimientosService,
    private transporteService: TransporteService,
    private vehiculoService: VehiculoService,
    private auth: authService
  ) {}
  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe());
  }
  /**
   * It opens a dialog box, and if the user confirms, it calls the anular function
   * @param elemento - the row that was clicked
   */
  public confirmacion(elemento): void {
    let dataElemento = elemento.data;

    let mensaje: string = "";
    if (dataElemento.anulacion) {
      mensaje = "¿Desea reactivar el registro? Es recomendable crear uno nuevo";
      this.subscripciones.push(
        this.dialogService
          .open(MensajeEntradaComponent, {
            context: {
              titulo: mensaje,
              mensajeAdvertencia:
                "Si el requerimiento de este transporte solo posee este registro, el requerimiento pasará a la fase de 'Terminado'",
            },
          })
          .onClose.subscribe((res) => {
            if (res) {
              this.validacionRequerimieno(
                dataElemento,
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
    } else {
      mensaje = "¿Desea anular el registro?";
      this.subscripciones.push(
        this.dialogService
          .open(MensajeEntradaComponent, {
            context: {
              titulo: mensaje,
              mensajeAdvertencia:
                "Si este es el único registro perteneciente al requerimiento se cambiará su estado a 'aprobado'",
            },
          })
          .onClose.subscribe((res) => {
            if (res) {
              this.anular(
                dataElemento,
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

  private validacionRequerimieno(
    transporte: any,
    motivoActivacion: string
  ): void {
    //(estadoTran === "Aprobado" || estadoTran === "Rechazado" || estadoTran === "Solicitado" || estadoTran === "Terminado")

    if (transporte.requerimientoId.estado === "Asignado") {
      this.evaluarVehiculo(transporte, motivoActivacion);
    } else {
      this.cambiarEstadoRequerimiento(transporte, motivoActivacion);
    }
  }

  /**
   * It checks if the vehicle assigned to the transport is available, if it is, it reactivates the
   * transport and changes the availability of the vehicle to false
   * @param {any} transporte - any, motivoActivacion: string
   * @param {string} motivoActivacion - string
   */
  private evaluarVehiculo(transporte: any, motivoActivacion: string): void {
    this.subscripciones.push(
      this.vehiculoService.buscar(transporte.vehiculoId.idVehiculo).subscribe(
        (res) => {
          if (res.estado) {
            this.reactivarTransporte(transporte, motivoActivacion);
            this.cambiarDisponibilidadVehiculo(res);
          } else {
            Util.showToast(
              "warning",
              "Atención",
              "El vehículo asignado a este registro no se encuentra disponible",
              8000,
              this.toastrService
            );
          }
        },
        (error) => {
          console.error(error);
          Util.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se buscaba el registro del vehículo " + error.error[0],
            0,
            this.toastrService
          );
        }
      )
    );
  }
  private cambiarEstadoRequerimiento(
    transporte: any,
    motivoActivacion: string
  ): void {
    let requerimiento = transporte.requerimientoId;
    requerimiento["estado"] = "Terminado";
    this.subscripciones.push(
      this.requerimientosService
        .editar(requerimiento.idRequerimiento, requerimiento)
        .subscribe(
          (res) => {
            Util.showToast(
              "success",
              "Acción realizada",
              "Se ha cambiado el estado al requerimiento",
              4000,
              this.toastrService
            );
            this.reactivarTransporte(transporte, motivoActivacion);
          },
          (error) => {
            console.error(error);
            Util.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se cambiaba el estado al requerimiento " +
                error.error[0],
              0,
              this.toastrService
            );
          }
        )
    );
  }

  private reactivarTransporte(transporte: any, motivo: string): void {
    this.subscripciones.push(
      this.transporteService.anular(transporte.idTransporte, motivo).subscribe(
        (res) => {
          Util.showToast(
            "success",
            "Acción realizada",
            "Se ha reactivado el registro",
            4000,
            this.toastrService
          );
          this.reconstruir(transporte, res);
        },
        (error) => {
          console.error(error);
          Util.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se reactivaba el registro " + error.error[0],
            0,
            this.toastrService
          );
        }
      )
    );
  }

  /* This method is used to cancel the selected transport. */
  //Método que permite la anulación del transporte seleccionado
  private anular(elemento: any, motivoAnulacion: string): void {
    this.subscripciones.push(
      this.transporteService
        .anular(elemento.idTransporte, motivoAnulacion)
        .subscribe(
          (res) => {
            Util.showToast(
              "success",
              "Acción realizada",
              "Se ha anulado el registro",
              4000,
              this.toastrService
            );
            //Se evalúa el requerimiento al que pertenece el trasporte anulado
            this.reconstruir(elemento, res);

            this.evaluacionRequerimientos(res);
          },
          (error) => {
            console.error(error);
            Util.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se anulaba el registro " + error.error[0],
              0,
              this.toastrService
            );
          }
        )
    );
  }
  //Método que cambia la disponibilidad del vehículo
  private cambiarDisponibilidadVehiculo(vehiculo: any): void {
    if (vehiculo.estado) {
      vehiculo["estado"] = false;
    } else {
      vehiculo["estado"] = true;
    }
    this.subscripciones.push(
      this.vehiculoService.editar(vehiculo.idVehiculo, vehiculo).subscribe(
        () => {
          Util.showToast(
            "success",
            "Acción realizada",
            "se ha cambiado el estado al vehículo",
            4000,
            this.toastrService
          );
        },
        (error) => {
          console.error(error);
          Util.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se cambiaba el estado al vehículo " + error.error[0],
            0,
            this.toastrService
          );
        }
      )
    );
  }

  //Este método permite la evaluación del requerimiento al que pertenece el transporte anulado
  private evaluacionRequerimientos(elemento: any): void {
    //Si el vehículo solo ha sido asignado (No se ha desocupado el vehículo) se cambia el estado al vehículo a disponible
    if (elemento.requerimientoId.estado === "Asignado") {
      this.cambiarDisponibilidadVehiculo(elemento.vehiculoId);
    }
    //Se evalúa cuantos registros pertenecientes al requerimiento del trasporte anulado activos existen
    this.subscripciones.push(
      this.transporteService
        .listarActivosPorRequerimiento(elemento.requerimientoId.idRequerimiento)
        .subscribe(
          (res) => {
            //Si no existe ninguno quere decir que el registro que fue anulado fue el último que pertenecía al requerimiento evaluado
            //Por lo tanto se cambia el estado al requerimiento a 'Aprobado'
            if (res.length == 0) {
              this.cambioEstadoRequerimiento(elemento.requerimientoId);
            }
          },
          (error) => {
            console.error(error);
            Util.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se verificaban los registros pertenecientes al requerimiento " +
                error.error[0],
              0,
              this.toastrService
            );
          }
        )
    );
  }
  //Método que sirve para cambiar el estado del requerimiento perteneciente a aprobado
  private cambioEstadoRequerimiento(elemento: any): void {
    elemento["estado"] = "Aprobado";
    this.subscripciones.push(
      this.requerimientosService
        .editar(elemento.idRequerimiento, elemento)
        .subscribe(
          () => {
            Util.showToast(
              "success",
              "Acción realizada",
              "Se ha cambiado el estado al requerimiento perteneciente ",
              4000,
              this.toastrService
            );
          },
          (error) => {
            console.error(error);
            Util.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se cambiaba el estado al requerimiento " +
                error.error[0],
              0,
              this.toastrService
            );
          }
        )
    );
  }
  private reconstruir(elementoAnterior: any, elementoNuevo: any): void {
    this.smartTransporte.remove(elementoAnterior);
    this.smartTransporte.add(elementoNuevo);
    this.smartTransporte.refresh();
  }

  public mostrar(): void {
    this.subscripciones.push(
      this.transporteService
        .listarPorFechas(this.fechaInicio, this.fechaFin)
        .subscribe(
          (resp) => {
            this.smartTransporte.load(resp);
            this.smartTransporte.refresh();
          },
          (error) => {
            console.error(error),
              Util.showToast(
                "danger",
                "Error " + error.status,
                "Mientras se realizaba la búsqueda de los transportes " +
                  error.error[0],
                0,
                this.toastrService
              );
          }
        )
    );
  }
}
