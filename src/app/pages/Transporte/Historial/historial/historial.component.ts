import { Component, OnDestroy, OnInit } from "@angular/core";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { Subscription } from "rxjs-compat";
import { authService } from "../../../../auth/auth.service";
import { MensajeEntradaComponent } from "../../../Globales/mensaje-entrada/mensaje-entrada.component";
import { Util } from "../../../Globales/Util";
import { RequerimientosService } from "../../../Requerimientos/requerimientos.service";
import { TransporteService } from "../../transporte.service";
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

  tipoSeleccionado = "";
  smartTransporte: LocalDataSource = new LocalDataSource();
  settingsTransporte = {
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
    private auth: authService
  ) {}
  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe());
  }
  public modificarTransporte(elemento): void {}
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
      this.transporteService
        .anular(elemento.idTransporte, motivoAnulacion)
        .subscribe(
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
