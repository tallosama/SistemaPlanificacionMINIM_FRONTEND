import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbToastrService } from "@nebular/theme";
import { VehiculoService } from "../../vehiculo.service";
import { Subscription } from "rxjs";
import { authService } from "../../../../../auth/auth.service";
import { Util } from "../../../../Globales/Util";

@Component({
  selector: "ngx-crear",
  templateUrl: "./crear.component.html",
  styleUrls: ["./crear.component.scss"],
})
export class CrearComponent implements OnInit, OnDestroy {
  fecha = new Date().toISOString().slice(0, 10);
  vehiculoForm: FormGroup;

  subscripciones: Array<Subscription> = [];
  constructor(
    public fb: FormBuilder,
    public vehiculoService: VehiculoService,
    private toastrService: NbToastrService,
    private auth: authService
  ) {}

  ngOnInit(): void {
    this.cargarForm(this.auth.getUserStorage());
  }

  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe);
  }
  private cargarForm(usuario) {
    this.vehiculoForm = this.fb.group({
      desVehiculo: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(512),
          Util.esVacio,
        ]),
      ],
      placa: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(32),
          Util.esVacio,
        ]),
      ],
      modelo: ["", Validators.maxLength(32)],
      marca: ["", Validators.maxLength(32)],
      estado: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(32)]),
      ],
      usuarioCreacion: [usuario.uid, Validators.required],
      fechaCreacion: [this.fecha, Validators.required],
      usuarioModificacion: [usuario.uid, Validators.required],
      fechaModificacion: [this.fecha, Validators.required],
    });
  }

  limpiar(): void {
    this.vehiculoForm.get("desVehiculo").reset();
    this.vehiculoForm.get("placa").reset();
    this.vehiculoForm.get("modelo").reset();
    this.vehiculoForm.get("marca").reset();
    this.vehiculoForm.get("estado").reset();
  }

  guardar(): void {
    this.subscripciones.push(
      this.vehiculoService
        .guardar(Util.limpiarForm(this.vehiculoForm.value))
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
