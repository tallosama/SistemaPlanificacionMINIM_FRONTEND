import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  NbGlobalPhysicalPosition,
  NbStepperComponent,
  NbToastrService,
} from "@nebular/theme";
import { DataTableDirective } from "angular-datatables";
import { Subject, Subscription } from "rxjs";
import { authService } from "../../../auth/auth.service";
import { AreaService } from "../../Catalogos/Area/area.service";
import { PlanificacionService } from "../../Planificacion/planificacion.service";
import { MunicipioService } from "../../ServiciosGlobales/Municipio/municipio.service";
import { EventosService } from "../eventos.service";

@Component({
  selector: "ngx-eventos",
  templateUrl: "./eventos.component.html",
  styleUrls: ["./eventos.component.scss"],
})
export class EventosComponent implements OnInit {
  @ViewChild(NbStepperComponent) stepper: NbStepperComponent;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  subscripciones: Array<Subscription> = [];

  //autocompletado
  keyword = ["desArea", "descripcion", "desMunicipio"];
  keywordPlan = "descripcion";
  public historyHeading: string = "Recientes";

  planes: any = [];
  areas: any = [];
  municipios: any = [];
  data: any = {};
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
    private municipioService: MunicipioService
  ) {}

  ngOnInit(): void {
    this.autoCompletados();
    this.usuario = this.auth.getUserStorage();

    this.cargarForm();
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
      // Estado: [this.estado[0].Estado, Validators.required],
      // Rol: ["", Validators.required],
      // PersonaId: [persona.idPersona, Validators.required],
      usuarioCreacion: [this.usuario.uid, Validators.required],
      fechaCreacion: [this.fecha, Validators.required],
      usuarioModificacion: [this.usuario.uid, Validators.required],
      fechaModificacion: [this.fecha, Validators.required],
    });
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
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
            "Mientras se listaban áreas " + error.message,
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
            "Mientras se listaban las planificaciones " + error.message,
            0
          );
        }
      )
    );
  }
  guardarEvento() {
    this.subscripciones.push(
      this.eventoService.guardar(this.eventoForm.value).subscribe(
        (resp) => {
          this.showToast(
            "success",
            "Acción realizada",
            "Se ha ingresado el registro",
            4000
          );

          this.limpiarEvento();
        },
        (error) => {
          console.error(error);
          this.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se registraba el evento " + error.message,
            0
          );
        }
      )
    );
  }
  public iniciarDetalle(): void {
    this.llenarMunicipio();
    this.detalleEventoForm = this.fb.group({
      hora: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(32),
          this.noWhitespaceValidator,
        ]),
      ],
      fecha: ["", Validators.required],
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
            "Mientras se listaban los municipios " + error.message,
            0
          );
        }
      )
    );
  }

  limpiarEvento(): void {
    this.eventoForm.get("desEveto").reset();
  }
  //construccion del mensaje
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

  for(r) {
    return r == null ? "nulo" : "vacio";
  }
}
