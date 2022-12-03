import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  NbDialogService,
  NbGlobalPhysicalPosition,
  NbStepperComponent,
  NbToastrService,
} from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { Subscription } from "rxjs";
import { authService } from "../../../../auth/auth.service";
import { AreaService } from "../../../Catalogos/Area/area.service";
import { DialogNamePromptComponent } from "../../../modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component";
import { PlanificacionService } from "../../../Planificacion/planificacion.service";
import { MunicipioService } from "../../../Globales/Servicios/municipio.service";
import { DetalleEventoService } from "../../detalle-evento.service";
import { EventosService } from "../../eventos.service";
import { Util } from "../../../Globales/Util";

@Component({
  selector: "ngx-buscar",
  templateUrl: "./buscar.component.html",
  styleUrls: ["./buscar.component.scss"],
})
export class BuscarComponent implements OnInit, OnDestroy {
  @ViewChild(NbStepperComponent) stepper: NbStepperComponent;

  keyword = ["desArea", "descripcion", "desMunicipio"];
  public historyHeading: string = "Recientes";

  planes: any;
  areas: any;
  municipios: any;

  eventoSeleccionado: any;
  planSeleccionado: any;
  detalleSeleccionado: any;

  sourceSmart: LocalDataSource = new LocalDataSource();
  sourceSmartDetalle: LocalDataSource = new LocalDataSource();
  settings = {
    mode: "external",

    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    actions: {
      columnTitle: "Acción",
      add: false,
      delete: false,
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
    },
  };

  settingsDetalle = {
    mode: "external",

    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
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

  autoCompletados(): void {
    this.subscripciones.push(
      this.areaService.listar().subscribe(
        (resp) => {
          this.areas = resp;
        },
        (error) => {
          console.error(error);
          this.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban las áreas" + error.error[0],

            0
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
          this.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban los planes" + error.error[0],

            0
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
          this.sourceSmart.load(resp);
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
      desEveto: [
        this.eventoSeleccionado.desEvento,
        Validators.compose([
          Validators.required,
          Validators.maxLength(1024),
          this.noWhitespaceValidator,
        ]),
      ],
      areaId: [this.eventoSeleccionado.areaId, Validators.required],
      planificacionId: [
        this.eventoSeleccionado.planificacionId,
        Validators.required,
      ],
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
              this.showToast(
                "success",
                "Acción realizada",
                "Se ha modificado el evento",
                4000
              );

              this.limpiarEvento();
              this.reconstruir(this.planSeleccionado);
              this.stepper.previous();
            },
            (error) => {
              console.error(error);
              this.showToast(
                "danger",
                "Error " + error.status,
                "Mientras se modificaba el evento" + error.error[0],

                0
              );
            }
          )
      );
    } else {
      this.showToast(
        "warning",
        "Atención",
        "No se puede editar el registro de un evento inexistente ",
        8000
      );
    }
  }
  limpiarEvento(): void {
    this.eventoForm.get("desEveto").reset();
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
              this.sourceSmartDetalle.load(r);
            },
            (error) => {
              console.error(error);
              this.showToast(
                "danger",
                "Error " + error.status,
                "Mientras se listaban los detalles" + error.error[0],

                0
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
          this.noWhitespaceValidator,
        ]),
      ],
      eventoId: [""],
      municipioId: ["", Validators.required],

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
          this.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban los municipios" + error.error[0],

            0
          );
        }
      )
    );
  }
  onEditarDetalle(event) {
    // debugger;
    if (this.detalleSeleccionado == null) {
      this.detalleSeleccionado = event.data;
      this.sourceSmartDetalle.remove(event.data);
      this.sourceSmartDetalle.refresh();

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
            this.showToast(
              "success",
              "Acción realizada",
              "Se ha ingresado el evento",
              4000
            );
            //Si todo sale bien, se registra en el smart table el nuevo resultado
            this.sourceSmartDetalle.add(resp);
            this.sourceSmartDetalle.refresh();
            this.limpiarDetalle();
          },
          (error) => {
            console.error(error);
            this.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se registraba el detalle de evento " + error.error[0],

              0
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
          this.showToast(
            "success",
            "Acción realizada",
            "Se ha ingresado el detalle del registro",
            4000
          );
          this.sourceSmartDetalle.add(resp);
          this.sourceSmartDetalle.refresh();
          this.limpiarDetalle();
        },
        (error) => {
          console.error(error);
          this.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se ingresaba un nuevo detalle " + error.error[0],

            0
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
  onBorrarDetalle(event) {
    this.subscripciones.push(
      this.dialogService
        .open(DialogNamePromptComponent, {
          context: {
            titulo: "¿Desea eliminar el registro?",
          },
        })
        .onClose.subscribe((res) => {
          if (res) {
            this.subscripciones.push(
              this.detalleEventoService
                .eliminar(event.data.idDetalleEvento)
                .subscribe(
                  (r) => {
                    if (r) {
                      this.showToast(
                        "success",
                        "Acción realizada",
                        "Se ha eliminado el registro",
                        4000
                      );
                    } else {
                      this.showToast(
                        "warning",
                        "Atención",
                        "No se ha encontrado el registro",
                        4000
                      );
                    }
                    this.sourceSmartDetalle.remove(event.data);
                    this.sourceSmartDetalle.refresh();
                  },
                  (error) => {
                    console.error(error);
                    this.showToast(
                      "danger",
                      "Error " + error.status,
                      "Mientras se eliminaba el registro" + error.error[0],

                      0
                    );
                  }
                )
            );
          }
        })
    );
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  public showToast(
    estado: string,
    titulo: string,
    cuerpo: string,
    duracion: number
  ) {
    const config = {
      status: estado,
      destroyByClick: true,
      duration: duracion,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: false,
    };

    this.toastrService.show(cuerpo, `${titulo}`, config);
  }
}
