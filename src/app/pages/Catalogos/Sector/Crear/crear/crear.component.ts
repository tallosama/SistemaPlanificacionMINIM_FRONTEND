import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbToastrService } from "@nebular/theme";
import { SectorService } from "../../sector.service";
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
  sectorForm: FormGroup;
  subscripcion: Array<Subscription> = [];
  constructor(
    private fb: FormBuilder,
    private sectorService: SectorService,
    private toastrService: NbToastrService,
    private auth: authService
  ) {}

  ngOnInit(): void {
    this.cargarForm(this.auth.getUserStorage());
  }
  ngOnDestroy(): void {
    this.subscripcion.forEach((s) => s.unsubscribe());
  }
  private cargarForm(usuario) {
    this.sectorForm = this.fb.group({
      desSector: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(128),
          Util.esVacio,
        ]),
      ],
      usuarioCreacion: [usuario.uid, Validators.required],
      fechaCreacion: [this.fecha, Validators.required],
      usuarioModificacion: [usuario.uid, Validators.required],
      fechaModificacion: [this.fecha, Validators.required],
    });
  }
  limpiar(): void {
    this.sectorForm.get("desSector").reset();
  }
  guardar(): void {
    this.subscripcion.push(
      this.sectorService
        .guardar(Util.limpiarForm(this.sectorForm.value))
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
