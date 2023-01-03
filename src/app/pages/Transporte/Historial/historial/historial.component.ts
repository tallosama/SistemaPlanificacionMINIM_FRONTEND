import { Component, OnDestroy, OnInit } from "@angular/core";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { Subscription } from "rxjs-compat";
import { Util } from "../../../Globales/Util";
import { RequerimientosService } from "../../../Requerimientos/requerimientos.service";
import { TransporteService } from "../../transporte.service";
import { RenderRequerimientoCantidadAprobadaComponent } from "./Renders/render-requerimiento-cantidad-aprobada/render-requerimiento-cantidad-aprobada.component";
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
      delete: false,
    },

    pager: {
      display: true,
      perPage: 5,
    },
    columns: {
      requerimientoId: {
        title: "Vehículo solicitado",
        valuePrepareFunction: (data) => {
          return data.desRequerimiento;
        },
      },
      CantidadAprobadaRequerimientoId: {
        title: "Cantidad aprobada",
        type: "custom",
        renderComponent: RenderRequerimientoCantidadAprobadaComponent,
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

  fechaInicio: string;
  fechaFin: string;

  constructor(
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private requerimientosService: RequerimientosService,
    private transporteService: TransporteService
  ) {}
  modificarTransporte(elemento) {}
  mostrar() {
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
  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe());
  }
}
