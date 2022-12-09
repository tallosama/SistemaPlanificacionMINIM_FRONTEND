import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbToastrService } from "@nebular/theme";
import { Subscription } from "rxjs";
import { authService } from "../../../../../auth/auth.service";
import { Util } from "../../../../Globales/Util";
import { AreaService } from "../../../Area/area.service";
import { CargoService } from "../../cargo.service";

@Component({
  selector: "ngx-crear",
  templateUrl: "./crear.component.html",
  styleUrls: ["./crear.component.scss"],
})
export class CrearComponent implements OnInit, OnDestroy {
  fecha = new Date().toISOString().slice(0, 10);

  cargoForm: FormGroup;
  subscripcion: Array<Subscription> = [];
  areas = [];
  constructor(
    private fb: FormBuilder,
    private cargoService: CargoService,
    private toastrService: NbToastrService,
    private areaService: AreaService,
    private auth: authService
  ) {}

  ngOnInit() {
    this.llenadoCombo();
    this.cargarForm(this.auth.getUserStorage());
  }
  ngOnDestroy(): void {
    this.subscripcion.forEach((s) => s.unsubscribe());
  }
  private llenadoCombo(): void {
    this.subscripcion.push(
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
  }
  private cargarForm(usuario) {
    this.cargoForm = this.fb.group({
      desCargo: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(100),
          Util.esVacio,
        ]),
      ],
      areaId: ["", Validators.required],
      usuarioCreacion: [usuario.uid, Validators.required],
      fechaCreacion: [this.fecha, Validators.required],
      usuarioModificacion: [usuario.uid, Validators.required],
      fechaModificacion: [this.fecha, Validators.required],
    });
  }

  limpiar(): void {
    this.cargoForm.get("desCargo").reset();
    this.cargoForm.value.areaId = this.areas[0];
  }
  guardar(): void {
    this.subscripcion.push(
      this.cargoService
        .guardar(Util.limpiarForm(this.cargoForm.value))
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
