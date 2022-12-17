import { Component, OnInit, OnDestroy } from "@angular/core";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { Subscription } from "rxjs";
import { ProductoService } from "../../producto.service";
import { DialogNamePromptComponent } from "../../../../modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component";
import { LocalDataSource } from "ng2-smart-table";
import { ActivatedRoute, Router } from "@angular/router";
import { Util } from "../../../../Globales/Util";
import { authService } from "../../../../../auth/auth.service";
import { MensajeEntradaComponent } from "../../../../Globales/mensaje-entrada/mensaje-entrada.component";

@Component({
  selector: "ngx-listado",
  templateUrl: "./listado.component.html",
  styleUrls: ["./listado.component.scss"],
})
export class ListadoComponent implements OnInit, OnDestroy {
  sourceSmart: LocalDataSource = new LocalDataSource();
  settings = {
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

    pager: {
      display: true,
      perPage: 5,
    },
    columns: {
      descripcion: {
        title: "Descripción",
        type: "string",
      },

      cantStock: {
        title: "Stock",
        type: "number",
      },
      tipoMaterial: {
        title: "Tipo de material",
        type: "string",
      },
      anulacion: {
        title: "Estado",
        valuePrepareFunction: (data) => {
          return data ? "Anulado" : "Activo";
        },
      },

      motivoAnulacion: {
        title: "Motivo",
        type: "string",
      },
    },
  };

  subscripciones: Array<Subscription> = [];
  // data: any;
  constructor(
    private productoService: ProductoService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: authService
  ) {}

  construir(): void {
    this.subscripciones.push(
      this.productoService.listar().subscribe(
        (resp: any) => {
          this.sourceSmart.load(resp);
          // this.data = resp;
          // this.dtTrigger.next();
        },
        (error) => {
          console.error(error);
          Util.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban los registros" + error.error[0],

            0,
            this.toastrService
          );
        }
      )
    );
  }

  reconstruir(elementoAnterior: any, elementoNuevo: any): void {
    this.sourceSmart.remove(elementoAnterior);
    this.sourceSmart.add(elementoNuevo);
    this.sourceSmart.refresh();
  }

  ngOnInit(): void {
    this.construir();
  }
  ngOnDestroy(): void {
    this.subscripciones.forEach((subs) => subs.unsubscribe());
  }
  confirmacion(elemento): void {
    let mensaje: string = elemento.data.anulacion
      ? "¿Desea reactivar el registro?"
      : "¿Desea anular el registro?";

    this.subscripciones.push(
      this.dialogService
        .open(MensajeEntradaComponent, {
          context: {
            titulo: mensaje,
          },
        })
        .onClose.subscribe((res) => {
          if (res) {
            this.anular(
              elemento.data,
              "'" +
                res +
                "', por " +
                this.auth.getUserStorage().email +
                " el " +
                new Date().toLocaleString()
            );
          }
        })
    );
  }

  anular(elemento: any, motivoAnulacion: string): void {
    this.subscripciones.push(
      this.productoService
        .anular(elemento.idProducto, motivoAnulacion)
        .subscribe(
          (res) => {
            let mensaje: string = res.anulacion
              ? "Se ha anulado el registro"
              : "Se ha reactivado el registro";

            Util.showToast(
              "success",
              "Acción realizada",
              mensaje,
              4000,
              this.toastrService
            );

            this.reconstruir(elemento, res);
          },
          (error) => {
            console.error(error);
            Util.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se anulaba el registro" + error.error[0],
              0,
              this.toastrService
            );
          }
        )
    );
  }

  editarRegistro(event) {
    this.router.navigate(["../EditarProducto", event.data.idProducto], {
      relativeTo: this.route,
    });
  }
}
