import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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
import { Subscription } from "rxjs";
import { PlanificacionService } from "../../planificacion.service";
import { authService } from "../../../../auth/auth.service";
import { Control } from "../../../Globales/Control";

@Component({
  selector: "ngx-editar",
  templateUrl: "./editar.component.html",
  styleUrls: ["./editar.component.scss"],
})
export class EditarComponent implements OnInit, OnDestroy {
  fecha = new Date().toISOString().slice(0, 10);
  planificacionForm: FormGroup;
  id: number;
  config: NbToastrConfig;
  subscripciones: Array<Subscription> = [];

  constructor(
    public fb: FormBuilder,
    private router: Router,
    public planificacionService: PlanificacionService,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
    private auth: authService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params["id"];
    this.cargarForm(this.auth.getUserStorage());
  }
  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe());
  }
  cargarForm(usuario): void {
    this.id = this.route.snapshot.params["id"];
    this.subscripciones.push(
      this.planificacionService.buscar(this.id).subscribe(
        (res) => {
          this.planificacionForm = this.fb.group({
            descripcion: [
              res.descripcion,
              Validators.compose([
                Validators.required,
                Validators.maxLength(128),
              ]),
            ],
            lema: [res.lema, Validators.maxLength(128)],
            fechaInicio: [res.fechaInicio, Validators.required],
            fechaFin: [res.fechaFin, Validators.required],
            usuarioModificacion: [usuario.uid, Validators.required],
            fechaModificacion: [this.fecha, Validators.required],
          });
        },
        (error) => {
          console.error(error);
          this.showToast(
            "danger",
            "Error" + error.status,
            "Mientras se buscaba un registro" +
              Control.evaluarErrorDependiente(error.error),

            0
          );
        }
      )
    );
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  public editar(): void {
    this.subscripciones.push(
      this.planificacionService
        .editar(this.id, this.planificacionForm.value)
        .subscribe(
          (resp) => {
            this.router.navigate(["../../ListarPlanificacion"], {
              relativeTo: this.route,
            });
            this.showToast(
              "success",
              "Acción realizada",
              "Se ha editado el registro",
              4000
            );
          },
          (error) => {
            console.error(error);
            this.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se editaba un registro" +
                Control.evaluarErrorRepetido(error.error),

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
