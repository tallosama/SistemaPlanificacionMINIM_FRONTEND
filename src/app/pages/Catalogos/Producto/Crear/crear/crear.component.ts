import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbToastrService, NbToastrConfig } from "@nebular/theme";
import { ProductoService } from "../../producto.service";
import { CategoriaService } from "../../../Categoria/categoria.service";
import { MedidaService } from "../../../UnidadMedida/medida.service";
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
  productoForm: FormGroup;
  //inicializadores del mensaje toast
  config: NbToastrConfig;
  tipoMaterial = [{ tipoM: "Bien de uso" }, { tipoM: "Consumible" }];
  categoria: any;
  unidadMedida: any;
  subscripciones: Array<Subscription> = [];

  constructor(
    private toastrService: NbToastrService,
    public fb: FormBuilder,
    public productoService: ProductoService,
    public categoriaService: CategoriaService,
    public unidadMedidaService: MedidaService,
    public auth: authService
  ) {}

  ngOnInit(): void {
    this.llenadoCombobox();
    this.cargarForm(this.auth.getUserStorage());
  }
  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe);
  }
  llenadoCombobox() {
    this.subscripciones.push(
      this.categoriaService.listar().subscribe(
        (resp) => {
          this.categoria = resp;
        },
        (error) => {
          console.error(error);
          Util.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban las categorías" + error.error[0],

            0,
            this.toastrService
          );
        }
      )
    );

    this.subscripciones.push(
      this.unidadMedidaService.listar().subscribe(
        (resp) => {
          this.unidadMedida = resp;
        },
        (error) => {
          console.error(error);
          Util.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban las unidades de medida" + error.error[0],

            0,
            this.toastrService
          );
        }
      )
    );
  }

  private cargarForm(usuario) {
    this.productoForm = this.fb.group({
      descripcion: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(128),
          Util.esVacio,
        ]),
      ],
      // cantMinima: ["", Validators.required],
      cantStock: ["", Validators.required],
      tipoMaterial: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      unidadMedidaId: ["", Validators.required],
      categoriaId: ["", Validators.required],
      anulacion: [false, Validators.required],
      motivoAnulacion: [""],

      usuarioCreacion: [usuario.uid, Validators.required],
      fechaCreacion: [this.fecha, Validators.required],
      usuarioModificacion: [usuario.uid, Validators.required],
      fechaModificacion: [this.fecha, Validators.required],
    });
  }

  limpiar(): void {
    this.productoForm.get("descripcion").reset();
    //this.productoForm.get("cantMinima").reset();
    this.productoForm.get("cantStock").reset();

    // this.productoForm.get('tipoMaterial').reset();
    // this.productoForm.get('unidadMedidaId').reset();
    // this.productoForm.get('categoriaId').reset();
  }

  guardar(): void {
    this.subscripciones.push(
      this.productoService
        .guardar(Util.limpiarForm(this.productoForm.value))
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
