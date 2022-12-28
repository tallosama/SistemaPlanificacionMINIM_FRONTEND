import { Component, OnDestroy, OnInit } from "@angular/core";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { Subscription } from "rxjs-compat";
import { DetalleEventoService } from "../../../Eventos/detalle-evento.service";
import { EventosService } from "../../../Eventos/eventos.service";
import { Util } from "../../../Globales/Util";
import { PlanificacionService } from "../../../Planificacion/planificacion.service";
import { SolicitudRequerimientoComponent } from "../Modales/solicitud-requerimiento/solicitud-requerimiento.component";
import { RenderRequerimientoComponent } from "../Renders/render-requerimiento/render-requerimiento.component";

@Component({
  selector: "ngx-solicitud",
  templateUrl: "./solicitud.component.html",
  styleUrls: ["./solicitud.component.scss"],
})
export class SolicitudComponent implements OnInit, OnDestroy {
  keyword = ["desEvento", "descripcion"];
  usuario: any;
  fecha = new Date().toISOString().slice(0, 10);
  planes = [];
  eventos = [];
  subscripciones: Array<Subscription> = [];
  public historyHeading: string = "Recientes";
  smartDetalle: LocalDataSource = new LocalDataSource();

  settingsDetalle = {
    mode: "external",

    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },

    actions: {
      columnTitle: "Agregar seguimiento",
      add: false,
      delete: false,
      edit: false,
    },
    pager: {
      display: true,
      perPage: 5,
    },
    columns: {
      municipioId: {
        title: "Municipio",
        valuePrepareFunction: (data) => {
          return data.desMunicipio;
        },
      },
      fecha: {
        title: "Fecha",
        type: "string",
      },
      hora: {
        title: "Hora",
        type: "string",
      },
      observaciones: {
        title: "Observación",
        type: "string",
      },

      participantesProyectado: {
        title: "Participantes",
        type: "number",
      },
      estado: {
        title: "Estado",
        type: "string",
      },
      renderRequerimiento: {
        filter: false,
        title: "Solicitar requerimientos",
        type: "custom",
        renderComponent: RenderRequerimientoComponent,
        onComponentInitFunction: (instance) => {
          instance.eventData.subscribe((detalleEvento) => {
            this.abrirModal(detalleEvento, SolicitudRequerimientoComponent);
          });
        },
      },
      // renderMaterial: {
      //   filter: false,
      //   title: "Solicitar materiales",
      //   type: "custom",
      //   renderComponent: RenderMaterialesComponent,
      //   onComponentInitFunction: (instance) => {
      //     instance.eventData.subscribe((detalleEvento) => {
      //       this.abrirModal(detalleEvento, SolicitudMaterialComponent);
      //     });
      //   },
      // },
      // renderTransporte: {
      //   filter: false,
      //   title: "Solicitar Transporte",
      //   type: "custom",
      //   renderComponent: RenderTransporteComponent,
      //   onComponentInitFunction: (instance) => {
      //     instance.eventData.subscribe((detalleEvento) => {
      //       this.abrirModal(detalleEvento, SolicitudTransporteComponent);
      //     });
      //   },
      // },
    },
  };

  constructor(
    private planService: PlanificacionService,
    private eventoService: EventosService,
    private detalleEventoService: DetalleEventoService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService
  ) {}
  ngOnInit(): void {
    this.autocompletadoPlan();
  }
  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe());
  }
  abrirModal(detalleEvento, componenteAbrir) {
    this.dialogService.open(componenteAbrir, {
      context: {
        data: detalleEvento,
      },
    });
  }
  autocompletadoPlan(): void {
    this.subscripciones.push(
      this.planService.listar().subscribe(
        (resp) => {
          this.planes = resp;
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
  public construirEventos(plan) {
    this.subscripciones.push(
      this.eventoService.listarPorPlan(plan.idPlanificacion).subscribe(
        (resp) => {
          this.eventos = resp;
        },
        (error) => {
          console.error(error);
          Util.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban los eventos " + error.error[0],

            0,
            this.toastrService
          );
        }
      )
    );
  }
  eventoSeleccionado: any;
  public construirDetalles(evento) {
    this.eventoSeleccionado = evento;
    this.subscripciones.push(
      this.detalleEventoService.listarPorEvento(evento.idEvento).subscribe(
        (resp) => {
          this.smartDetalle.load(resp);
          this.smartDetalle.refresh();
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
}
