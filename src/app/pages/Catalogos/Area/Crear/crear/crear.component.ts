import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbToastrService } from "@nebular/theme";
import { Subscription } from "rxjs";
import { AreaService } from "../../area.service";
import { authService } from "../../../../../auth/auth.service";
import { Util } from "../../../../Globales/Util";
@Component({
  selector: "ngx-crear",
  templateUrl: "./crear.component.html",
  styleUrls: ["./crear.component.scss"],
})
export class CrearComponent implements OnInit, OnDestroy {
  fecha = new Date().toISOString().slice(0, 10);
  areaForm: FormGroup;
  subscripcion: Array<Subscription> = [];

  constructor(
    public fb: FormBuilder,
    public areaServices: AreaService,
    private toastrService: NbToastrService,

    private auth: authService
  ) {}

  ngOnInit() {
    // await this.auth.getUser().then((r) => (this.usuario = r)); //Si queremos trabajar con datos de promesas, usar un awair para almacenar lo que retorna

    this.cargarForm(this.auth.getUserStorage());
  }
  ngOnDestroy(): void {
    this.subscripcion.forEach((s) => s.unsubscribe());
  }
  limpiar(): void {
    this.areaForm.get("desArea").reset();
  }
  cargarForm(user): void {
    this.areaForm = this.fb.group({
      desArea: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(512),
          Util.esVacio,
        ]),
      ],
      usuarioCreacion: [user.uid, Validators.required],
      fechaCreacion: [this.fecha, Validators.required],
      usuarioModificacion: [user.uid, Validators.required],
      fechaModificacion: [this.fecha, Validators.required],
    });
  }

  guardar(): void {
    this.subscripcion.push(
      this.areaServices
        .guardar(Util.limpiarForm(this.areaForm.value))
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
              "Error " + error.status,
              "Mientras se realizaba un registro" + error.error[0],
              0,
              this.toastrService
            );
          }
        )
    );
  }
}
