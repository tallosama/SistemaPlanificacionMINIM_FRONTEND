import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbToastrService } from "@nebular/theme";
import { Subscription } from "rxjs";
import { PlanificacionService } from "../../planificacion.service";
import { authService } from "../../../../auth/auth.service";
import { Util } from "../../../Globales/Util";

@Component({
  selector: "ngx-editar",
  templateUrl: "./editar.component.html",
  styleUrls: ["./editar.component.scss"],
})
export class EditarComponent implements OnInit, OnDestroy {
  fecha = new Date().toISOString().slice(0, 10);
  planificacionForm: FormGroup;
  id: number;
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
                Util.esVacio,
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
          Util.showToast(
            "danger",
            "Error" + error.status,
            "Mientras se buscaba un registro" + error.error[0],

            0,
            this.toastrService
          );
        }
      )
    );
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
            Util.showToast(
              "success",
              "Acción realizada",
              "Se ha editado el registro",
              4000,
              this.toastrService
            );
          },
          (error) => {
            console.error(error);
            Util.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se editaba un registro" + error.error[0],

              0,
              this.toastrService
            );
          }
        )
    );
  }
}
