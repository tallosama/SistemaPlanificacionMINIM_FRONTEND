import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { NbToastrService, NbToastrConfig } from "@nebular/theme";
import { RolService } from "../../rol.service";
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
  rolForm: FormGroup;
  //inicializadores del mensaje toast
  config: NbToastrConfig;
  subscripcion: Array<Subscription> = [];

  constructor(
    public fb: UntypedFormBuilder,
    public rolService: RolService,
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
    this.rolForm = this.fb.group({
      desRol: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(512),
          Util.esVacio,
        ]),
      ],
      anulacion: [false, Validators.required],
      motivoAnulacion: [""],

      usuarioCreacion: [usuario.uid, Validators.required],
      fechaCreacion: [this.fecha, Validators.required],
      usuarioModificacion: [usuario.uid, Validators.required],
      fechaModificacion: [this.fecha, Validators.required],
    });
  }

  limpiar(): void {
    this.rolForm.get("desRol").reset();
  }

  guardar(): void {
    this.subscripcion.push(
      this.rolService.guardar(Util.limpiarForm(this.rolForm.value)).subscribe(
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
