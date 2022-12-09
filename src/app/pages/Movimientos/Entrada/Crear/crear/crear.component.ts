import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  NbDialogService,
  NbGlobalPhysicalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { Subscription } from "rxjs";
import { authService } from "../../../../../auth/auth.service";
import { ProductoService } from "../../../../Catalogos/Producto/producto.service";
import { Util } from "../../../../Globales/Util";
import { DialogNamePromptComponent } from "../../../../modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component";
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
      deleteButtonContent: '<i class="nb-trash"></i>',
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

  constructor(
    private toastrService: NbToastrService,
    private fb: FormBuilder,
    private productoService: ProductoService,
    private entradaService: EntradaService,
    private auth: authService,

    private dialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    this.llenadoComboBox();
    this.cargarForm(this.auth.getUserStorage());
  }

  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe);
  }

  private llenadoComboBox() {
    this.subscripciones.push(
      this.productoService.listar().subscribe(
        (resp) => {
          this.productos = resp;
        },
        (error) => {
          console.error(error);
          this.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban los productos " + error.error[0],

            0
          );
        }
      )
    );
  }
  cargarForm(usuario): void {
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
        "",
        Validators.compose([Validators.required, Util.noObjeto]),
      ],

      fechaEntrada: [
        new Date().toISOString().slice(0, 10),
        Validators.required,
      ],
      usuarioCreacion: [usuario.uid, Validators.required],
      fechaCreacion: [this.fecha, Validators.required],
      usuarioModificacion: [usuario.uid, Validators.required],
      fechaModificacion: [this.fecha, Validators.required],
    });
  }

  public agregar() {
    this.smartEntrada.add(this.entradaForm.value);
    this.smartEntrada.refresh();
  }
  public guardar() {}
  public editarEntrada(event) {
    if (this.productoSeleccionado == null) {
      this.productoSeleccionado = event.data;
      this.smartEntrada.remove(event.data);
      this.smartEntrada.refresh();
    }
  }
  public borrarEntrada(event) {
    this.subscripciones.push(
      this.dialogService
        .open(DialogNamePromptComponent, {
          context: {
            titulo: "¿Desea eliminar el registro?",
          },
        })
        .onClose.subscribe((res) => {
          if (res) {
            this.smartEntrada.remove(event.data);
            this.smartEntrada.refresh();
          }
        })
    );
  }

  public limpiar(): void {
    this.entradaForm.get("descripEntrada").reset();
    this.entradaForm.get("cantTotal").reset();
    this.entradaForm.get("productoId").reset();
    this.entradaForm
      .get("fechaEntrada")
      .setValue(new Date().toISOString().slice(0, 10));
  }

  private showToast(
    estado: string,
    titulo: string,
    cuerpo: string,
    duracion: number
  ) {
    const config = {
      status: estado,
      destroyByClick: true,
      duration: duracion,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: false,
    };

    this.toastrService.show(cuerpo, `${titulo}`, config);
  }
}
