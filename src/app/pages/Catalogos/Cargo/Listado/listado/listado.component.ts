import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { Subscription } from "rxjs";
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
      deleteButtonContent: '<i class="nb-trash"></i>',
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
    private route: ActivatedRoute
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

  reconstruir(id: any): void {
    this.smartCargo.remove(id);
    this.smartCargo.refresh();
  }

  ngOnInit(): void {
    this.construir();
  }
  ngOnDestroy(): void {
    this.subscripciones.forEach((subs) => subs.unsubscribe());
  }
  confirmacion(id): void {
    this.subscripciones.push(
      this.dialogService
        .open(DialogNamePromptComponent, {
          context: {
            cuerpo: "¿Desea eliminar el registro?",
          },
        })
        .onClose.subscribe((res) => {
          if (res) {
            this.eliminar(id.data);
          }
        })
    );
  }
  eliminar(data): void {
    this.subscripciones.push(
      this.cargoService.eliminar(data.idCargo).subscribe(
        (res) => {
          if (res) {
            Util.showToast(
              "success",
              "Acción realizada",
              "Se ha eliminado el registro",
              4000,
              this.toastrService
            );
          } else {
            Util.showToast(
              "warning",
              "Atención",
              "No se ha encontrado el registro",
              4000,
              this.toastrService
            );
          }
          this.reconstruir(data);
        },
        (error) => {
          console.error(error);
          Util.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se eliminaba el registro" + error.error[0],
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
