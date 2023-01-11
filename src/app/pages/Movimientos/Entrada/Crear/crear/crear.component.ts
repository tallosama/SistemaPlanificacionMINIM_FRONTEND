import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbToastrConfig, NbToastrService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { Subscription } from "rxjs";
import { authService } from "../../../../../auth/auth.service";
import { ProductoService } from "../../../../Catalogos/Producto/producto.service";
import { Util } from "../../../../Globales/Util";
import { EntradaService } from "../../entrada.service";

@Component({
  selector: "ngx-crear",
  templateUrl: "./crear.component.html",
  styleUrls: ["./crear.component.scss"],
})
export class CrearComponent implements OnInit, OnDestroy {
  fecha = new Date().toISOString().slice(0, 10);
  entradaForm: FormGroup;
  config: NbToastrConfig;
  subscripciones: Array<Subscription> = [];
  keyword = ["descripcion"];
  productos = [];
  productoSeleccionado: any;
  smartEntrada: LocalDataSource = new LocalDataSource();
  settingsEntrada = {
    mode: "external",

    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-alert"></i>',
    },
    actions: {
      columnTitle: "Acción",
      add: false,
    },
    hideSubHeader: true,
    pager: {
      display: true,
      perPage: 5,
    },
    columns: {
      descripEntrada: {
        title: "Descripción",
        type: "string",
      },
      cantTotal: {
        title: "Cantidad",
        type: "number",
      },

      fechaEntrada: {
        title: "Fecha de entrada",
        type: "string",
      },
      productoId: {
        title: "Producto",
        valuePrepareFunction: (data) => {
          return data.descripcion;
        },
      },
    },
  };
  usuario: any;
  constructor(
    private toastrService: NbToastrService,
    private fb: FormBuilder,
    private productoService: ProductoService,
    private entradaService: EntradaService,
    private auth: authService
  ) {}

  ngOnInit(): void {
    this.llenadoComboBox();
    this.usuario = this.auth.getUserStorage();
    this.cargarForm();
  }
  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe);
  }
  /**
   * It gets all the entries from the database and then saves them to the server.
   */
  public guardar(): void {
    this.smartEntrada
      .getAll()
      .then((lista) => {
        return lista;
      })
      .then((elementos) => {
        elementos.forEach((e) => {
          this.guardarEntrada(e);
        });
      })
      .catch((error) => {
        console.error(error);
        Util.showToast(
          "danger",
          "Error " + error.status,
          "Mientras se obtenian las entradas " + error.error[0],

          0,
          this.toastrService
        );
      });
  }
  private guardarEntrada(nuevaEntrada: any) {
    this.entradaService
      .guardar(nuevaEntrada)
      .toPromise()
      .then((entrada) => {
        Util.showToast(
          "success",
          "Acción realizada",
          "Se ha ingresado la entrada",
          4000,
          this.toastrService
        );
        this.remover(nuevaEntrada);
        return entrada;
      })
      .then((entrada) => {
        this.actualizarProducto(entrada);
      })
      .catch((error) => {
        console.error(error);
        Util.showToast(
          "danger",
          "Error " + error.status,
          "Mientras se guardaban las entradas " + error.error[0],

          0,
          this.toastrService
        );
      });
  }
  private actualizarProducto(entrada: any) {
    this.productoService
      .agregarStock(entrada.productoId.idProducto, entrada.cantTotal)
      .toPromise()
      .then((res) => {
        Util.showToast(
          "success",
          "Acción realizada",
          "Se ha actualizado la cantidad del producto",
          4000,
          this.toastrService
        );
      })
      .catch((error) => {
        console.error(error);
        Util.showToast(
          "danger",
          "Error " + error.status,
          "Mientras se actualizaba el producto " + error.error[0],

          0,
          this.toastrService
        );
      });
  }
  private llenadoComboBox(): void {
    this.subscripciones.push(
      this.productoService.listar().subscribe(
        (resp) => {
          this.productos = resp;
        },
        (error) => {
          console.error(error);
          Util.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban los productos " + error.error[0],

            0,
            this.toastrService
          );
        }
      )
    );
  }
  private cargarForm(): void {
    this.productoSeleccionado = null;
    this.entradaForm = this.fb.group({
      descripEntrada: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(128),
          Util.esVacio,
        ]),
      ],
      cantTotal: ["", Validators.required],
      anulacion: [false, Validators.required],
      productoId: [
        this.productos[0],
        Validators.compose([Validators.required, Util.noObjeto]),
      ],
      motivoAnulacion: ["", Validators.maxLength(255)],
      fechaEntrada: [
        new Date().toISOString().slice(0, 10),
        Validators.required,
      ],
      usuarioCreacion: [this.usuario.uid, Validators.required],
      fechaCreacion: [this.fecha, Validators.required],
      usuarioModificacion: [this.usuario.uid, Validators.required],
      fechaModificacion: [this.fecha, Validators.required],
    });
  }
  private cargarDataForm(data): void {
    this.entradaForm = this.fb.group({
      descripEntrada: [
        data.descripEntrada,
        Validators.compose([
          Validators.required,
          Validators.maxLength(128),
          Util.esVacio,
        ]),
      ],
      cantTotal: [data.cantTotal, Validators.required],
      anulacion: [data.anulacion, Validators.required],
      productoId: [
        data.productoId,
        Validators.compose([Validators.required, Util.noObjeto]),
      ],
      motivoAnulacion: [data.motivoAnulacion, Validators.maxLength(255)],
      fechaEntrada: [data.fechaEntrada, Validators.required],
      usuarioCreacion: [data.usuarioCreacion, Validators.required],
      fechaCreacion: [data.fechaCreacion, Validators.required],
      usuarioModificacion: [data.usuarioModificacion, Validators.required],
      fechaModificacion: [data.fechaModificacion, Validators.required],
    });
  }
  public agregarForm(): void {
    this.agregar(this.entradaForm.value);
    this.cargarForm();
  }
  public agregar(data: any): void {
    this.smartEntrada.add(data);
    this.smartEntrada.refresh();
  }
  public editarEntrada(event) {
    if (this.productoSeleccionado == null) {
      this.productoSeleccionado = event.data;
      this.remover(this.productoSeleccionado);
      this.cargarDataForm(this.productoSeleccionado);
    }
  }
  public evaluarCancelacion(): void {
    if (this.productoSeleccionado != null) {
      this.agregar(this.productoSeleccionado);
      this.productoSeleccionado = null;
    }
    this.cargarForm();
  }
  public borrarEntrada(event): void {
    // this.subscripciones.push(
    //   this.dialogService
    //     .open(DialogNamePromptComponent, {
    //       context: {
    //         titulo: "¿Desea eliminar el registro?",
    //       },
    //     })
    //     .onClose.subscribe((res) => {
    //       if (res) {
    this.remover(event.data);
    //       }
    //     })
    // );
  }
  private remover(elemento: any): void {
    this.smartEntrada.remove(elemento);
    this.smartEntrada.refresh();
  }
}
