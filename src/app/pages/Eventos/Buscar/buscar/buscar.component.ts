import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  NbDialogService,
  NbStepperComponent,
  NbToastrService,
} from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { Subscription } from "rxjs";
import { authService } from "../../../../auth/auth.service";
import { AreaService } from "../../../Catalogos/Area/area.service";
import { PlanificacionService } from "../../../Planificacion/planificacion.service";
import { MunicipioService } from "../../../Globales/Servicios/municipio.service";
import { DetalleEventoService } from "../../detalle-evento.service";
import { EventosService } from "../../eventos.service";
import { Util } from "../../../Globales/Util";
import { RenderPersonalComponent } from "./renders/renderPersonal/render-personal.component";
import { PersonasAsignadasComponent } from "../personas-asignadas/personas-asignadas.component";
import { MensajeEntradaComponent } from "../../../Globales/mensaje-entrada/mensaje-entrada.component";
import { AsignarSectoresComponent } from "../asignar-sectores/asignar-sectores.component";
import { RenderSectorComponent } from "./renders/renderSector/render-sector.component";

@Component({
  selector: "ngx-buscar",
  templateUrl: "./buscar.component.html",
  styleUrls: ["./buscar.component.scss"],
})
export class BuscarComponent implements OnInit, OnDestroy {
  @ViewChild(NbStepperComponent) stepper: NbStepperComponent;

  keyword = ["desArea", "descripcion", "desMunicipio"];
  public historyHeading: string = "Recientes";

  planes: any = [];
  areas: any = [];
  municipios: any = [];

  eventoSeleccionado: any;
  planSeleccionado: any;
  detalleSeleccionado: any;

  smartEvento: LocalDataSource = new LocalDataSource();
  smartDetalle: LocalDataSource = new LocalDataSource();
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
    hideSubHeader: true,
    pager: {
      display: true,
      perPage: 5,
    },
    columns: {
      desEvento: {
        title: "Descripción",
        type: "string",
      },
      areaId: {
        title: "Área",
        valuePrepareFunction: (data) => {
          return data.desArea;
        },
      },
      planificacionId: {
        title: "Planificación",
        valuePrepareFunction: (data) => {
          return data.descripcion;
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

  settingsDetalle = {
    mode: "external",

    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-alert"></i>',
    },
    // hideSubHeader: true,
    actions: {
      columnTitle: "Acciones",
      add: false,
    },
    pager: {
      display: true,
      perPage: 5,
    },
    columns: {
      observaciones: {
        title: "Observación",
        type: "string",
      },
      fecha: {
        title: "Fecha",
        type: "string",
      },
      hora: {
        title: "Hora",
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
      municipioId: {
        title: "Municipio",
        valuePrepareFunction: (data) => {
          return data.desMunicipio;
        },
      },

      button: {
        filter: false,
        title: "Asignar personal",
        type: "custom",
        renderComponent: RenderPersonalComponent,
        onComponentInitFunction: (instance) => {
          instance.eventData.subscribe((detalleEvento) => {
            this.abrirModal(detalleEvento, PersonasAsignadasComponent);
          });
        },
      },
      buttonAsignarSector: {
        filter: false,
        title: "Asignar sector",
        type: "custom",
        renderComponent: RenderSectorComponent,
        onComponentInitFunction: (instance) => {
          instance.eventData.subscribe((detalleEvento) => {
            this.abrirModal(detalleEvento, AsignarSectoresComponent);
          });
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

  usuario: any;
  fecha = new Date().toISOString().slice(0, 10);

  subscripciones: Array<Subscription> = [];

  eventoForm: FormGroup;
  detalleEventoForm: FormGroup;

  constructor(
    private planService: PlanificacionService,
    private auth: authService,
    private toastrService: NbToastrService,
    private eventoService: EventosService,
    private fb: FormBuilder,
    private areaService: AreaService,
    private municipioService: MunicipioService,
    private detalleEventoService: DetalleEventoService,
    private dialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    this.autoCompletados();
    this.usuario = this.auth.getUserStorage();
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
  autoCompletados(): void {
    this.subscripciones.push(
      this.areaService.listar().subscribe(
        (resp) => {
          this.areas = resp;
        },
        (error) => {
          console.error(error);
          Util.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban las áreas" + error.error[0],

            0,
            this.toastrService
          );
        }
      )
    );

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
  reconstruir(plan) {
    this.planSeleccionado = plan;
    this.subscripciones.push(
      this.eventoService
        .listarPorPlan(plan.idPlanificacion)
        .subscribe((resp) => {
          this.smartEvento.load(resp);
        })
    );
  }
  onEditRowSelect(event) {
    this.stepper.next();
    this.eventoSeleccionado = event.data;

    this.cargarEventoForm();
  }
  cargarEventoForm() {
    this.eventoForm = this.fb.group({
      desEvento: [
        this.eventoSeleccionado.desEvento,
        Validators.compose([
          Validators.required,
          Validators.maxLength(1024),
          Util.esVacio,
        ]),
      ],
      areaId: [
        this.eventoSeleccionado.areaId,
        Validators.compose([Util.noObjeto, Validators.required]),
      ],
      planificacionId: [
        this.eventoSeleccionado.planificacionId,
        Validators.compose([Util.noObjeto, Validators.required]),
      ],
      anulacion: [this.eventoSeleccionado.anulacion, Validators.required],
      motivoAnulacion: [this.eventoSeleccionado.motivoAnulacion],
      usuarioModificacion: [this.usuario.uid, Validators.required],
      fechaModificacion: [this.fecha, Validators.required],
    });
  }

  editarEvento() {
    if (!this.eventoForm.invalid && this.eventoSeleccionado != null) {
      this.subscripciones.push(
        this.eventoService
          .editar(this.eventoSeleccionado.idEvento, this.eventoForm.value)
          .subscribe(
            (resp) => {
              Util.showToast(
                "success",
                "Acción realizada",
                "Se ha modificado el evento",
                4000,
                this.toastrService
              );

              this.limpiarEvento();
              this.reconstruir(this.planSeleccionado);
              this.stepper.previous();
            },
            (error) => {
              console.error(error);
              Util.showToast(
                "danger",
                "Error " + error.status,
                "Mientras se modificaba el evento" + error.error[0],

                0,
                this.toastrService
              );
            }
          )
      );
    } else {
      Util.showToast(
        "warning",
        "Atención",
        "No se puede editar el registro de un evento inexistente ",
        8000,
        this.toastrService
      );
    }
  }
  limpiarEvento(): void {
    this.eventoForm.get("desEvento").reset();
    this.eventoForm.get("areaId").reset();
    this.eventoForm.get("planificacionId").reset();
    this.eventoSeleccionado = null;
  }

  cargarDetalles() {
    if (this.eventoSeleccionado != null) {
      this.stepper.next();
      this.cargarDetalleEventoForm();
      //buscar detalles por actividad
      this.subscripciones.push(
        this.detalleEventoService
          .listarPorEvento(this.eventoSeleccionado.idEvento)
          .subscribe(
            (r) => {
              this.smartDetalle.load(r);
            },
            (error) => {
              console.error(error);
              Util.showToast(
                "danger",
                "Error " + error.status,
                "Mientras se listaban los detalles" + error.error[0],

                0,
                this.toastrService
              );
            }
          )
      );
    }
  }
  cargarDetalleEventoForm() {
    this.llenarMunicipio();
    this.detalleEventoForm = this.fb.group({
      hora: [
        new Date(),
        Validators.compose([Validators.required, Validators.maxLength(60)]),
      ],
      fecha: [new Date().toISOString().slice(0, 10), Validators.required],
      participantesProyectado: [50, Validators.required],
      observaciones: ["", Validators.maxLength(512)],
      estado: [
        "Pendiente",
        Validators.compose([
          Validators.required,
          Validators.maxLength(32),
          Util.esVacio,
        ]),
      ],
      eventoId: [""],
      municipioId: [
        "",
        Validators.compose([Util.noObjeto, Validators.required]),
      ],
      anulacion: [false, Validators.required],
      motivoAnulacion: [""],
      usuarioCreacion: [this.usuario.uid, Validators.required],
      fechaCreacion: [this.fecha, Validators.required],
      usuarioModificacion: [this.usuario.uid, Validators.required],
      fechaModificacion: [this.fecha, Validators.required],
    });
  }

  private llenarMunicipio(): void {
    this.subscripciones.push(
      this.municipioService.listar().subscribe(
        (resp) => {
          this.municipios = resp;
        },
        (error) => {
          console.error(error);
          Util.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban los municipios" + error.error[0],

            0,
            this.toastrService
          );
        }
      )
    );
  }
  onEditarDetalle(event) {
    // debugger;
    if (this.detalleSeleccionado == null) {
      this.detalleSeleccionado = event.data;
      this.smartDetalle.remove(event.data);
      this.smartDetalle.refresh();

      this.agregarDetalle();
    }
  }
  agregarDetalle() {
    this.detalleEventoForm
      .get("hora")
      .setValue(Util.getHoraDate(this.detalleSeleccionado.hora));
    this.detalleEventoForm
      .get("fecha")
      .setValue(this.detalleSeleccionado.fecha);
    this.detalleEventoForm
      .get("participantesProyectado")
      .setValue(this.detalleSeleccionado.participantesProyectado);
    this.detalleEventoForm
      .get("observaciones")
      .setValue(this.detalleSeleccionado.observaciones);
    this.detalleEventoForm
      .get("eventoId")
      .setValue(this.detalleSeleccionado.eventoId);
    this.detalleEventoForm
      .get("municipioId")
      .setValue(this.detalleSeleccionado.municipioId);

    this.detalleEventoForm
      .get("anulacion")
      .setValue(this.detalleSeleccionado.anulacion);

    this.detalleEventoForm
      .get("motivoAnulacion")
      .setValue(this.detalleSeleccionado.motivoAnulacion);
  }

  agregarTabla() {
    //Se convierte la hora retornada por el del combobox a AMPM
    this.detalleEventoForm.value.hora = Util.getHoraAmPm(
      this.detalleEventoForm.value.hora
    );

    this.subscripciones.push(
      this.detalleEventoService
        .editar(
          this.detalleSeleccionado.idDetalleEvento,
          this.detalleEventoForm.value
        )
        .subscribe(
          (resp) => {
            Util.showToast(
              "success",
              "Acción realizada",
              "Se ha ingresado el evento",
              4000,
              this.toastrService
            );
            //Si todo sale bien, se registra en el smart table el nuevo resultado
            this.smartDetalle.add(resp);
            this.smartDetalle.refresh();
            this.limpiarDetalle();
          },
          (error) => {
            console.error(error);
            Util.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se registraba el detalle de evento " + error.error[0],

              0,
              this.toastrService
            );
          }
        )
    );
  }
  registrarDetalle() {
    //Se convierte la hora retornada por el del combobox a AMPM
    this.detalleEventoForm.value.hora = Util.getHoraAmPm(
      this.detalleEventoForm.value.hora
    );
    //Se asigna la actividad seleccionada al nuevo detalle
    this.detalleEventoForm.value.eventoId = this.eventoSeleccionado;

    this.subscripciones.push(
      this.detalleEventoService.guardar(this.detalleEventoForm.value).subscribe(
        (resp) => {
          Util.showToast(
            "success",
            "Acción realizada",
            "Se ha ingresado el detalle del registro",
            4000,
            this.toastrService
          );
          this.smartDetalle.add(resp);
          this.smartDetalle.refresh();
          this.limpiarDetalle();
        },
        (error) => {
          console.error(error);
          Util.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se ingresaba un nuevo detalle " + error.error[0],

            0,
            this.toastrService
          );
        }
      )
    );
  }
  limpiarDetalle() {
    this.detalleEventoForm.get("hora").setValue(new Date());
    this.detalleEventoForm
      .get("fecha")
      .setValue(new Date().toISOString().slice(0, 10));
    this.detalleEventoForm.get("participantesProyectado").setValue(50);
    this.detalleEventoForm.get("observaciones").reset();
    this.detalleEventoForm.get("eventoId").reset();
    this.detalleSeleccionado = null;
  }
  onBorrarDetalle(elemento) {
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
            this.anularDetalle(
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

    // this.subscripciones.push(
    //   this.dialogService
    //     .open(DialogNamePromptComponent, {
    //       context: {
    //         cuerpo: "¿Desea eliminar el registro?",
    //       },
    //     })
    //     .onClose.subscribe((res) => {
    //       if (res) {
    //         this.subscripciones.push(
    //           this.detalleEventoService
    //             .eliminar(event.data.idDetalleEvento)
    //             .subscribe(
    //               (r) => {
    //                 if (r) {
    //                   Util.showToast(
    //                     "success",
    //                     "Acción realizada",
    //                     "Se ha eliminado el registro",
    //                     4000,
    //                     this.toastrService
    //                   );
    //                 } else {
    //                   Util.showToast(
    //                     "warning",
    //                     "Atención",
    //                     "No se ha encontrado el registro",
    //                     4000,
    //                     this.toastrService
    //                   );
    //                 }
    //                 this.smartDetalle.remove(event.data);
    //                 this.smartDetalle.refresh();
    //               },
    //               (error) => {
    //                 console.error(error);
    //                 Util.showToast(
    //                   "danger",
    //                   "Error " + error.status,
    //                   "Mientras se eliminaba el registro" + error.error[0],

    //                   0,
    //                   this.toastrService
    //                 );
    //               }
    //             )
    //         );
    //       }
    //     })
    // );
  }
  anularDetalle(elemento: any, motivoAnulacion: string): void {
    this.subscripciones.push(
      this.detalleEventoService
        .anular(elemento.idDetalleEvento, motivoAnulacion)
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

            this.reconstruirDetalle(elemento, res);
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
  reconstruirDetalle(elementoAnterior: any, elementoNuevo: any): void {
    this.smartDetalle.remove(elementoAnterior);
    this.smartDetalle.add(elementoNuevo);
    this.smartDetalle.refresh();
  }

  // public eliminar(data) {
  //   this.subscripciones.push(
  //     this.eventoService.eliminar(data.idEvento).subscribe(
  //       (r) => {
  //         if (r) {
  //           Util.showToast(
  //             "success",
  //             "Acción realizada",
  //             "Se ha eliminado el registro",
  //             4000,
  //             this.toastrService
  //           );
  //         } else {
  //           Util.showToast(
  //             "warning",
  //             "Atención",
  //             "No se ha encontrado el registro",
  //             4000,
  //             this.toastrService
  //           );
  //         }
  //         this.smartEvento.remove(data);
  //         this.smartEvento.refresh();
  //       },
  //       (error) => {
  //         console.error(error);
  //         Util.showToast(
  //           "danger",
  //           "Error " + error.status,
  //           "Mientras se eliminaba el registro" + error.error[0],

  //           0,
  //           this.toastrService
  //         );
  //       }
  //     )
  //   );
  // }

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
            this.anularEvento(
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
  anularEvento(elemento: any, motivoAnulacion: string): void {
    this.subscripciones.push(
      this.eventoService.anular(elemento.idEvento, motivoAnulacion).subscribe(
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

          this.reconstruirEvento(elemento, res);
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
  reconstruirEvento(elementoAnterior: any, elementoNuevo: any): void {
    this.smartEvento.remove(elementoAnterior);
    this.smartEvento.add(elementoNuevo);
    this.smartEvento.refresh();
  }

  // confirmacion(event): void {
  //   this.subscripciones.push(
  //     this.dialogService
  //       .open(DialogNamePromptComponent, {
  //         context: {
  //           cuerpo: "¿Desea eliminar el registro?",
  //         },
  //       })
  //       .onClose.subscribe((res) => {
  //         if (res) {
  //           this.eliminar(event.data);
  //         }
  //       })
  //   );
  // }
}
