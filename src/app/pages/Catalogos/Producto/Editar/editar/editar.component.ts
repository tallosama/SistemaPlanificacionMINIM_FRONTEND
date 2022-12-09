import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbToastrService, NbToastrConfig } from "@nebular/theme";
import { ProductoService } from "../../producto.service";
import { CategoriaService } from "../../../Categoria/categoria.service";
import { MedidaService } from "../../../UnidadMedida/medida.service";
import { Subscription } from "rxjs";
import { authService } from "../../../../../auth/auth.service";
import { Util } from "../../../../Globales/Util";

@Component({
  selector: "ngx-editar",
  templateUrl: "./editar.component.html",
  styleUrls: ["./editar.component.scss"],
})
export class EditarComponent implements OnInit, OnDestroy {
  fecha = new Date().toISOString().slice(0, 10);
  productoForm: FormGroup;
  id: number;
  //inicializadores del mensaje toast
  config: NbToastrConfig;
  tipoMaterial = [{ tipoM: "Bien de uso" }, { tipoM: "Consumible" }];
  categoria: any;
  unidadMedida: any;
  subscripciones: Array<Subscription> = [];
  constructor(
    public fb: FormBuilder,
    private router: Router,
    public productoService: ProductoService,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
    public categoriaService: CategoriaService,
    public unidadMedidaService: MedidaService,
    private auth: authService
  ) {}

  private llenadoCombobox(): void {
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

  ngOnInit(): void {
    this.llenadoCombobox();
    this.id = this.route.snapshot.params["id"];
    this.cargarForm(this.auth.getUserStorage());
  }
  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe());
  }
  private cargarForm(usuario) {
    this.subscripciones.push(
      this.productoService.buscar(this.id).subscribe(
        (res) => {
          this.productoForm = this.fb.group({
            descripcion: [
              res.descripcion,
              Validators.compose([
                Validators.required,
                Validators.maxLength(128),
                Util.esVacio,
              ]),
            ],
            //   cantMinima: [res.cantMinima, Validators.required],
            cantStock: [res.cantStock, Validators.required],
            tipoMaterial: [
              res.tipoMaterial,
              Validators.compose([
                Validators.required,
                Validators.maxLength(50),
              ]),
            ],
            unidadMedidaId: [
              this.unidadMedida.find(
                (u) => u.idUnidadMedida == res.unidadMedidaId.idUnidadMedida
              ),
              Validators.required,
            ],
            categoriaId: [
              this.categoria.find(
                (c) => c.idCategoria == res.categoriaId.idCategoria
              ),
              Validators.required,
            ],
            usuarioModificacion: [usuario.uid, Validators.required],
            fechaModificacion: [this.fecha, Validators.required],
          });
        },
        (error) => {
          console.error(error);
          Util.showToast(
            "danger",
            "Error " + error.status,
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
      this.productoService
        .editar(this.id, Util.limpiarForm(this.productoForm.value))
        .subscribe(
          (resp) => {
            this.router.navigate(["../../ListarProducto"], {
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
