import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
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
import { authService } from "../../../auth/auth.service";
import { AreaService } from "../../Catalogos/Area/area.service";
import { DialogNamePromptComponent } from "../../modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component";
import { PlanificacionService } from "../../Planificacion/planificacion.service";
import { MunicipioService } from "../../Globales/Servicios/municipio.service";
import { DetalleEventoService } from "../detalle-evento.service";
import { EventosService } from "../eventos.service";
import { Util } from "../../Globales/Util";
@Component({
  selector: "ngx-eventos",
  templateUrl: "./eventos.component.html",
  styleUrls: ["./eventos.component.scss"],
})
export class EventosComponent implements OnInit, OnDestroy {
  /* A decorator that allows you to query elements in the template. */
  @ViewChild(NbStepperComponent) stepper: NbStepperComponent;
  subscripciones: Array<Subscription> = [];

  //autocompletado
  keyword = ["desArea", "descripcion", "desMunicipio"];
  public historyHeading: string = "Recientes";

  sourceSmart: LocalDataSource = new LocalDataSource();

  planes: any = [];
  areas: any = [];
  municipios: any = [];
  detalleSeleccionado: any;

  eventoForm: FormGroup;
  detalleEventoForm: FormGroup;
  usuario: any;
  fecha = new Date().toISOString().slice(0, 10);

  constructor(
    private fb: FormBuilder,
    private auth: authService,
    private toastrService: NbToastrService,
    private eventoService: EventosService,
    private areaService: AreaService,
    private planService: PlanificacionService,
    private municipioService: MunicipioService,
    private detalleEventoService: DetalleEventoService,
    private dialogService: NbDialogService
  ) {}

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
            "Mientras se listaban las planificaciones" + error.error[0],

            0
          );
        }
      )
    );
  }
  ngOnInit(): void {
    this.autoCompletados();
    this.usuario = this.auth.getUserStorage();
    //this.sourceSmart.setPaging(5);
    this.cargarForm();
  }

  ngOnDestroy(): void {
    this.subscripciones.forEach((subs) => subs.unsubscribe());
  }
  cargarForm() {
    this.eventoForm = this.fb.group({
      desEveto: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(1024),
          this.noWhitespaceValidator,
        ]),
      ],
      areaId: ["", Validators.required],
      planificacionId: ["", Validators.required],
      usuarioCreacion: [this.usuario.uid, Validators.required],
      fechaCreacion: [this.fecha, Validators.required],
      usuarioModificacion: [this.usuario.uid, Validators.required],
      fechaModificacion: [this.fecha, Validators.required],
    });
  }

  limpiarEvento(): void {
    this.eventoForm.get("desEveto").reset();
  }
  /**
   * If the value of the control is not whitespace, return null, otherwise return an error object with a
   * whitespace property.
   * @param {FormControl} control - FormControl - The control to validate.
   * @returns an object with a key of whitespace and a value of true.
   */
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  /**
   * It takes the values from the form and sends them to the server.
   */
  guardarEvento() {
    if (!this.eventoForm.invalid) {
      this.subscripciones.push(
        this.eventoService.guardar(this.eventoForm.value).subscribe(
          (resp) => {
            this.showToast(
              "success",
              "Acción realizada",
              "Se ha ingresado el evento",
              4000
            );

            this.limpiarEvento();
          },
          (error) => {
            console.error(error);
            this.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se registraba el evento" + error.error[0],
              0
            );
          }
        )
      );
    } else {
      this.showToast(
        "warning",
        "Atención",
        "No se pueden registrar los detalles de un evento inexistente ",
        8000
      );
    }
  }

  guardarEventoConDetalle() {
    if (!this.eventoForm.invalid) {
      this.subscripciones.push(
        this.eventoService.guardar(this.eventoForm.value).subscribe(
          (resp) => {
            this.showToast(
              "success",
              "Acción realizada",
              "Se ha ingresado el evento",
              4000
            );

            this.guardarDetalle(resp);
            this.limpiarEvento();
          },
          (error) => {
            console.error(error);
            this.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se registraba el evento" + error.error[0],

              0
            );
          }
        )
      );
    } else {
      this.showToast(
        "warning",
        "Atención",
        "No se pueden registrar los detalles de un evento inexistente ",
        8000
      );
    }
  }
  //Este método se inicia cuando el usuario desea agregar detalles al evento
  public iniciarDetalle(): void {
    this.llenarMunicipio();
    this.detalleEventoForm = this.fb.group({
      hora: [
        new Date(),
        Validators.compose([Validators.required, Validators.maxLength(32)]),
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

  agregarTabla() {
    //formatos de horas
    // console.log(this.detalleEventoForm.value.hora.toTimeString());
    // console.log(this.detalleEventoForm.value.hora.toISOString());
    // console.log(this.detalleEventoForm.value.hora.toLocaleTimeString());
    // console.log(this.detalleEventoForm.value.hora.toLocaleTimeString("en-US"));

    //Se convierte la hora retornada por el del combobox a AMPM
    this.detalleEventoForm.value.hora = Util.getHoraAmPm(
      this.detalleEventoForm.value.hora
    );

    this.sourceSmart.add(this.detalleEventoForm.value);
    this.sourceSmart.refresh();
    this.limpiarDetalle();
  }
  onEditRowSelect(event) {
    // debugger;
    if (this.detalleSeleccionado == null) {
      event.data.hora = Util.getHoraDate(event.data.hora);
      this.detalleSeleccionado = event.data;
      this.detalleSeleccionado.hora = new Date(event.data.hora);

      this.sourceSmart.remove(event.data);
      this.sourceSmart.refresh();

      this.agregarDetalle();
    }
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
  agregarDetalle() {
    this.detalleEventoForm.get("hora").setValue(this.detalleSeleccionado.hora);
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

  onDeleteRowSelect(event) {
    this.subscripciones.push(
      this.dialogService
        .open(DialogNamePromptComponent, {
          context: {
            titulo: "¿Desea eliminar el registro?",
          },
        })
        .onClose.subscribe((res) => {
          if (res) {
            this.sourceSmart.remove(event.data);
            this.sourceSmart.refresh();
          }
        })
    );
  }

  settings = {
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
      // custom: [
      //   { name: "sector", title: '<i class="nb-compose"></i>' },
      //   //   { name: "editrecord", title: '<i class="nb-edit"></i>' },
      // ],
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
        //debugger;
        // editor: {
        //   type: "list",
        //   config: {
        //     selectText: "Select...",
        //     list:this.municipios
        //   },
        // },
      },
      //Agregar botones al smarttable
      // Actions: {
      //   title: "Detail",
      //   type: "html",
      //   valuePrepareFunction: (cell, row) => {
      //     //return "<a title='See Detail Product' > <i class='ion-edit'></i></a>";
      //     return " <i class='ion-edit'></i> ";
      //   },
      //   filter: false,
      // },
    },
  };

  /**
   * It subscribes to the listar() method of the municipioService, which returns an
   * Observable&lt;Municipio[]&gt;, and then assigns the result to the municipios property of the
   * component.
   */
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
  async guardarDetalle(elemento) {
    await this.sourceSmart
      .getAll()
      .then((arregloElementos) => {
        for (let detalle of arregloElementos) {
          this.sourceSmart.remove(detalle);
          detalle.eventoId = elemento;
          this.subscripciones.push(
            this.detalleEventoService.guardar(detalle).subscribe(
              (resp) => {
                this.showToast(
                  "success",
                  "Acción realizada",
                  "Se ha ingresado el detalle del registro",
                  4000
                );
              },
              (error) => {
                console.error(error);
                this.showToast(
                  "danger",
                  "Error " + error.status,
                  "Mientras se ingresaba un detalles" + error.error[0],

                  0
                );
              }
            )
          );
        }
        this.sourceSmart.refresh();
      })
      .catch((e) => console.error(e));
  }

  guardarTodo() {
    if (this.sourceSmart.count() > 0) {
      this.guardarEventoConDetalle();
    } else {
      this.guardarEvento();
    }
    this.stepper.previous();
  }
  /**
*construccion del mensaje
 * This function is used to display a toast message on the screen.
 @param {string} estado - string,
 @param {string} titulo - string,
 @param {string} cuerpo - string,
 @param {number} duracion - number -&gt; duration of the toast
 */
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
