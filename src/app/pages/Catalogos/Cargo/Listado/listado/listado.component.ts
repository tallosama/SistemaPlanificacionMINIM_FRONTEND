import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { Subscription } from "rxjs";
import { authService } from "../../../../../auth/auth.service";
import { MensajeEntradaComponent } from "../../../../Globales/mensaje-entrada/mensaje-entrada.component";
import { Util } from "../../../../Globales/Util";
import { DialogNamePromptComponent } from "../../../../modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component";
import { CargoService } from "../../cargo.service";

@Component({
  selector: "ngx-listado",
  templateUrl: "./listado.component.html",
  styleUrls: ["./listado.component.scss"],
})
export class ListadoComponent implements OnInit {
  smartCargo: LocalDataSource = new LocalDataSource();
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
      desCargo: {
        title: "Descripción",
        type: "string",
      },
      areaId: {
        title: "Área",
        valuePrepareFunction: (data) => {
          return data.desArea;
        },
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

  /* An array of subscriptions. */
  subscripciones: Array<Subscription> = [];
  //data: any;
  constructor(
    private cargoService: CargoService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: authService
  ) {}
  construir(): void {
    this.subscripciones.push(
      this.cargoService.listar().subscribe(
        (resp: any) => {
          this.smartCargo.load(resp);
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
    this.smartCargo.remove(elementoAnterior);
    this.smartCargo.add(elementoNuevo);
    this.smartCargo.refresh();
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
      this.cargoService.anular(elemento.idCargo, motivoAnulacion).subscribe(
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
    this.router.navigate(["../EditarCargo", event.data.idCargo], {
      relativeTo: this.route,
    });
  }
}
