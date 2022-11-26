import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  NbGlobalPhysicalPosition,
  NbToastrService,
  NbToastrConfig,
} from "@nebular/theme";
import { PlanificacionService } from "../../planificacion.service";
import { authService } from "../../../../auth/auth.service";
import { Control } from "../../../Globales/Control";

@Component({
  selector: "ngx-crear",
  templateUrl: "./crear.component.html",
  styleUrls: ["./crear.component.scss"],
})
export class CrearComponent implements OnInit {
  fecha = new Date().toISOString().slice(0, 10);
  regPlanificacionForm: FormGroup;
  config: NbToastrConfig;
  subscripciones: Array<Subscription> = [];

  constructor(
    private toastrService: NbToastrService,
    private fb: FormBuilder,
    private planificacionService: PlanificacionService,
    private auth: authService
  ) {}

  ngOnInit(): void {
    this.cargarForm(this.auth.getUserStorage());
  }

  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe);
  }
  cargarForm(usuario): void {
    this.regPlanificacionForm = this.fb.group({
      descripcion: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(128),
          this.noWhitespaceValidator,
        ]),
      ],
      lema: ["", Validators.maxLength(128)],
      fechaInicio: ["", Validators.required],
      fechaFin: ["", Validators.required],
      usuarioCreacion: [usuario.uid, Validators.required],
      fechaCreacion: [this.fecha, Validators.required],
      usuarioModificacion: [usuario.uid, Validators.required],
      fechaModificacion: [this.fecha, Validators.required],
    });
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  limpiar(): void {
    this.regPlanificacionForm.get("descripcion").reset();
    this.regPlanificacionForm.get("lema").reset();
    this.regPlanificacionForm.get("fechaInicio").reset();
    this.regPlanificacionForm.get("fechaFin").reset();
  }

  guardar(): void {
    this.subscripciones.push(
      this.planificacionService
        .guardar(this.regPlanificacionForm.value)
        .subscribe(
          (resp) => {
            this.showToast(
              "success",
              "Acción realizada",
              "Se ha ingresado el registro",
              4000
            );

            this.limpiar();
          },
          (error) => {
            console.error(error);
            this.showToast(
              "danger",
              "Error" + error.status,
              "Mientras se realizaba un registro" + error.error[0],

              0
            );
          }
        )
    );
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
}
