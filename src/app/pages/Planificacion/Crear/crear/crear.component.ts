import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbToastrService } from "@nebular/theme";
import { PlanificacionService } from "../../planificacion.service";
import { authService } from "../../../../auth/auth.service";
import { Util } from "../../../Globales/Util";

@Component({
  selector: "ngx-crear",
  templateUrl: "./crear.component.html",
  styleUrls: ["./crear.component.scss"],
})
export class CrearComponent implements OnInit, OnDestroy {
  fecha = new Date().toISOString().slice(0, 10);
  regPlanificacionForm: FormGroup;
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
          Util.esVacio,
        ]),
      ],
      lema: ["", Validators.maxLength(128)],
      fechaInicio: [new Date().toISOString().slice(0, 10), Validators.required],
      fechaFin: [new Date().toISOString().slice(0, 10), Validators.required],
      usuarioCreacion: [usuario.uid, Validators.required],
      fechaCreacion: [this.fecha, Validators.required],
      usuarioModificacion: [usuario.uid, Validators.required],
      fechaModificacion: [this.fecha, Validators.required],
    });
  }

  limpiar(): void {
    this.regPlanificacionForm.get("descripcion").reset();
    this.regPlanificacionForm.get("lema").reset();
    this.regPlanificacionForm
      .get("fechaInicio")
      .setValue(new Date().toISOString().slice(0, 10));
    this.regPlanificacionForm
      .get("fechaFin")
      .setValue(new Date().toISOString().slice(0, 10));
  }

  guardar(): void {
    this.subscripciones.push(
      this.planificacionService
        .guardar(this.regPlanificacionForm.value)
        .subscribe(
          (resp) => {
            Util.showToast(
              "success",
              "Acción realizada",
              "Se ha ingresado el registro",
              4000,
              this.toastrService
            );

            this.limpiar();
          },
          (error) => {
            console.error(error);
            Util.showToast(
              "danger",
              "Error" + error.status,
              "Mientras se realizaba un registro" + error.error[0],

              0,
              this.toastrService
            );
          }
        )
    );
  }
}
