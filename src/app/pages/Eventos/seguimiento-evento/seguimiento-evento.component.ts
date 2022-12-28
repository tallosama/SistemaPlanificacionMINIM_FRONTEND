import { Component, OnDestroy, OnInit } from "@angular/core";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { Subscription } from "rxjs";
import { Util } from "../../Globales/Util";
import { PlanificacionService } from "../../Planificacion/planificacion.service";
import { DetalleEventoService } from "../detalle-evento.service";
import { EventosService } from "../eventos.service";
import { AsignarSeguimientoComponent } from "../SeguimientoEvento/Asignacion/asignar-seguimiento/asignar-seguimiento.component";
import { BuscarSeguimientoComponent } from "../SeguimientoEvento/BuscarSeguimiento/buscar-seguimiento/buscar-seguimiento.component";

@Component({
  selector: "ngx-seguimiento-evento",
  templateUrl: "./seguimiento-evento.component.html",
  styleUrls: ["./seguimiento-evento.component.scss"],
})
export class SeguimientoEventoComponent implements OnInit, OnDestroy {
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
    },
  };

  constructor(
    private planService: PlanificacionService,
    private eventoService: EventosService,
    private detalleEventoService: DetalleEventoService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService
  ) {}

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
  public asignarSeguimiento(elemento) {
    let detalleSeleccionado = elemento.data;
    if (detalleSeleccionado.estado === "Pendiente") {
      this.subscripciones.push(
        this.dialogService
          .open(AsignarSeguimientoComponent, {
            context: {
              detalleEvento: detalleSeleccionado,
            },
          })
          .onClose.subscribe((res) => {
            if (res) {
              this.construirDetalles(this.eventoSeleccionado);
              Util.showToast(
                "success",
                "Acción realizada",
                "Se ha ingresado el registro",
                4000,
                this.toastrService
              );
            }
          })
      );
    } else {
      Util.showToast(
        "warning",
        "Atención",
        "El evento seleccionado ya posee un seguimiento ",
        4000,
        this.toastrService
      );
    }
  }
  public registros(): void {
    this.subscripciones.push(
      this.dialogService
        .open(BuscarSeguimientoComponent, {
          context: {
            eventoId: this.eventoSeleccionado,
          },
        })
        .onClose.subscribe(() => {
          this.construirDetalles(this.eventoSeleccionado);
        })
    );
  }
  ngOnInit(): void {
    this.autocompletadoPlan();
  }
  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe());
  }
}
