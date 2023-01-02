import { Component, OnDestroy, OnInit } from "@angular/core";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { Subscription } from "rxjs-compat";
import { Util } from "../../../Globales/Util";
import { RequerimientosService } from "../../../Requerimientos/requerimientos.service";
import { DetalleEventoFechaComponent } from "../Renders/detalle-evento-fecha/detalle-evento-fecha.component";
import { DetalleEventoHoraComponent } from "../Renders/detalle-evento-hora/detalle-evento-hora.component";
import { AsignarTransporteComponent } from "./Modales/asignar-transporte/asignar-transporte.component";

@Component({
  selector: "ngx-asignacion",
  templateUrl: "./asignacion.component.html",
  styleUrls: ["./asignacion.component.scss"],
})
export class AsignacionComponent implements OnInit, OnDestroy {
  data = [];
  subscripciones: Array<Subscription> = [];
  tipos = [
    { titulo: "Transportes pendientes", valor: "Aprobado" },
    { titulo: "Transportes asignados", valor: "Asignado" },
  ];
  tipoSeleccionado = "";
  smartRequerimientos: LocalDataSource = new LocalDataSource();
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
      delete: false,
    },

    pager: {
      display: true,
      perPage: 5,
    },
    columns: {
      detalleEventoId: {
        title: "Municipio",
        valuePrepareFunction: (data) => {
          return data.municipioId.desMunicipio;
        },
      },
      fechaEvento: {
        title: "Fecha del evento",
        type: "custom",
        renderComponent: DetalleEventoFechaComponent,
      },
      HoraEvento: {
        title: "Hora del evento",
        type: "custom",
        renderComponent: DetalleEventoHoraComponent,
      },
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
    },
  };

  constructor(
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private requerimientosService: RequerimientosService
  ) {}

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe());
  }

  public llenadoTablaRequerimiento(tipo): void {
    this.tipoSeleccionado = tipo.valor;
    this.subscripciones.push(
      this.requerimientosService
        .listarPorTipoYEstado("Transporte", this.tipoSeleccionado)
        .subscribe(
          (resp) => {
            this.smartRequerimientos.load(resp);
            this.smartRequerimientos.refresh();
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
  public asignarTransporte(elemento): void {
    if (this.tipoSeleccionado === "Aprobado") {
      this.abrirModal(elemento.data, AsignarTransporteComponent);
    } else {
      this.abrirModal(elemento.data, AsignarTransporteComponent);
    }
  }
  private abrirModal(requerimientoSeleccionado, componenteAbrir) {
    this.dialogService
      .open(componenteAbrir, {
        context: {
          requerimiento: requerimientoSeleccionado,
        },
      })
      .onClose.subscribe((r) => {
        if (r) {
          Util.showToast(
            "success",
            "Acción realizada",
            "Se han asignado los recursos",
            4000,
            this.toastrService
          );
          this.removerDeTabla(requerimientoSeleccionado);
        }
      });
  }
  private removerDeTabla(elemento): void {
    this.smartRequerimientos.remove(elemento);
    this.smartRequerimientos.refresh();
  }
}
