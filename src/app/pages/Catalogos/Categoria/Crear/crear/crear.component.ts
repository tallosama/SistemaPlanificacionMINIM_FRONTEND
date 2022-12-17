import { Component, OnDestroy, OnInit } from "@angular/core";
import { CategoriaService } from "../../categoria.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbToastrService } from "@nebular/theme";
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

  categoriaForm: FormGroup;
  subscripcion: Array<Subscription> = [];
  constructor(
    public fb: FormBuilder,
    public categoriaService: CategoriaService,
    private toastrService: NbToastrService,
    private auth: authService
  ) {}

  ngOnInit() {
    this.cargarForm(this.auth.getUserStorage());
  }
  ngOnDestroy(): void {
    this.subscripcion.forEach((s) => s.unsubscribe());
  }
  cargarForm(usuario) {
    this.categoriaForm = this.fb.group({
      descripCategoria: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(100),
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
    this.categoriaForm.get("descripCategoria").reset();
  }
  guardar(): void {
    this.subscripcion.push(
      this.categoriaService
        .guardar(Util.limpiarForm(this.categoriaForm.value))
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
