import { Component, OnInit } from "@angular/core";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { Subscription } from "rxjs";
import { authService } from "../../../../../auth/auth.service";
import { ProductoService } from "../../../../Catalogos/Producto/producto.service";
import { MensajeEntradaComponent } from "../../../../Globales/mensaje-entrada/mensaje-entrada.component";
import { Util } from "../../../../Globales/Util";
import { RequerimientosService } from "../../../../Requerimientos/requerimientos.service";
import { EntradaService } from "../../entrada.service";

@Component({
  selector: "ngx-listar",
  templateUrl: "./listar.component.html",
  styleUrls: ["./listar.component.scss"],
})
export class ListarComponent implements OnInit {
  subscripciones: Array<Subscription> = [];
  smartHistorial: LocalDataSource = new LocalDataSource();
  settingsHistorial = {
    mode: "external",

    delete: {
      deleteButtonContent: '<i class="nb-alert"></i>',
    },
    actions: {
      columnTitle: "Acción",
      add: false,
      edit: false,
    },

    pager: {
      display: true,
      perPage: 5,
    },
    columns: {
      productoId: {
        title: "Producto",
        type: "string",
        valuePrepareFunction: (data) => {
          return data.descripcion;
        },
      },

      descripEntrada: {
        title: "Descripción de la entrada",
        type: "string",
      },

      cantTotal: {
        title: "Cantidad de entrada",
        type: "number",
      },
      fechaEntrada: {
        title: "Fecha de entrada",
        type: "string",
      },
      anulacion: {
        title: "Estado",
        valuePrepareFunction: (data) => {
          return data ? "Anulado" : "Activo";
        },
      },
      motivoAnulacion: {
        title: "Motivo de anulación",
        type: "string",
      },
    },
  };

  fechaInicio: string = new Date().toISOString().slice(0, 10);
  fechaFin: string = new Date().toISOString().slice(0, 10);

  constructor(
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private auth: authService,
    private entradaService: EntradaService,
    private productoService: ProductoService
  ) {}
  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe());
  }
  confirmacion(elemento): void {
    let isAnulado: boolean = elemento.data.anulacion;

    let mensaje: string = isAnulado
      ? "¿Desea reactivar el registro?"
      : "¿Desea anular el registro?";
    let context: any;

    if (isAnulado) {
      context = {
        titulo: mensaje,
        mensajeAdvertencia: "Es recomendable crear un registro nuevo",
      };
    } else {
      context = {
        titulo: mensaje,
      };
    }

    this.subscripciones.push(
      this.dialogService
        .open(MensajeEntradaComponent, {
          context,
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
      this.entradaService
        .anular(elemento.idEntradasMateriales, motivoAnulacion)
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
            this.actualizarStockProducto(
              elemento.productoId.idProducto,
              elemento.cantTotal,
              res.anulacion
            );
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

  private actualizarStockProducto(
    entradaId: number,
    cantidad: number,
    isAnulacion: boolean
  ): void {
    if (isAnulacion) {
      this.subscripciones.push(
        this.productoService.restarStock(entradaId, cantidad).subscribe(
          (res) => {
            Util.showToast(
              "success",
              "Acción realizada",
              "Se ha restado la entrada al producto",
              4000,
              this.toastrService
            );
          },
          (error) => {
            console.error(error);
            Util.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se restaba el producto " + error.error[0],
              0,
              this.toastrService
            );
          }
        )
      );
    } else {
      this.subscripciones.push(
        this.productoService.agregarStock(entradaId, cantidad).subscribe(
          (res) => {
            Util.showToast(
              "success",
              "Acción realizada",
              "Se ha agregado la entrada al producto",
              4000,
              this.toastrService
            );
          },
          (error) => {
            console.error(error);
            Util.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se sumaba al producto " + error.error[0],
              0,
              this.toastrService
            );
          }
        )
      );
    }
  }

  private reconstruir(elementoAnterior: any, elementoNuevo: any): void {
    this.smartHistorial.remove(elementoAnterior);
    this.smartHistorial.add(elementoNuevo);
    this.smartHistorial.refresh();
  }

  public mostrar(): void {
    this.subscripciones.push(
      this.entradaService
        .listarPorFechas(this.fechaInicio, this.fechaFin)
        .subscribe(
          (resp) => {
            this.smartHistorial.load(resp);
            this.smartHistorial.refresh();
          },
          (error) => {
            console.error(error),
              Util.showToast(
                "danger",
                "Error " + error.status,
                "Mientras se realizaba la búsqueda de las entradas " +
                  error.error[0],
                0,
                this.toastrService
              );
          }
        )
    );
  }
}
