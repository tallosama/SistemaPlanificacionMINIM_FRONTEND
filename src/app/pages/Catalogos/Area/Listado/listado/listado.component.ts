import { Component, OnDestroy, OnInit } from "@angular/core";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { DialogNamePromptComponent } from "../../../../modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component";
import { AreaService } from "../../area.service";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { LocalDataSource } from "ng2-smart-table";
import { Util } from "../../../../Globales/Util";
import { MensajeEntradaComponent } from "../../../../Globales/mensaje-entrada/mensaje-entrada.component";

@Component({
  selector: "ngx-listado",
  templateUrl: "./listado.component.html",
  styleUrls: ["./listado.component.scss"],
})
export class ListadoComponent implements OnInit, OnDestroy {
  subscripciones: Array<Subscription> = [];

  sourceSmart: LocalDataSource = new LocalDataSource();
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
      desArea: {
        title: "Descripción",
        type: "string",
      },
    },
  };

  constructor(
    private areaService: AreaService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  construir(): void {
    this.subscripciones.push(
      this.areaService.listar().subscribe(
        (resp: any) => {
          this.sourceSmart.load(resp);
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
    this.subscripciones.push(
      this.dialogService
        .open(MensajeEntradaComponent, {
          context: {
            titulo: "¿Desea anular el registro?",
          },
        })
        .onClose.subscribe((res) => {
          if (res) {
            this.anular(elemento.data, res);
          }
        })
    );

    // this.subscripciones.push(
    //   this.dialogService
    //     .open(DialogNamePromptComponent, {
    //       context: {
    //         cuerpo: "¿Desea eliminar el registro?",
    //       },
    //     })
    //     .onClose.subscribe((res) => {
    //       if (res) {
    //         this.eliminar(id.data);
    //       }
    //     })
    // );
  }

  anular(elemento: any, motivoAnulacion: string): void {
    this.subscripciones.push(
      this.areaService.anular(elemento.idArea, motivoAnulacion).subscribe(
        (res) => {
          Util.showToast(
            "success",
            "Acción realizada",
            "Se ha anulado el registro",
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
            "Mientras se eliminaba el registro" + error.error[0],
            0,
            this.toastrService
          );
        }
      )
    );
  }
  // eliminar(id): void {
  //   this.subscripciones.push(
  //     this.areaService.eliminar(id.idArea).subscribe(
  //       (res) => {
  //         if (res) {
  //           Util.showToast(
  //             "success",
  //             "Acción realizada",
  //             "Se ha eliminado el registro",
  //             4000,
  //             this.toastrService
  //           );
  //         } else {
  //           Util.showToast(
  //             "warning",
  //             "Atención",
  //             "No se ha encontrado el registro",
  //             4000,
  //             this.toastrService
  //           );
  //         }

  //         this.reconstruir(id);
  //       },
  //       (error) => {
  //         console.error(error);
  //         Util.showToast(
  //           "danger",
  //           "Error " + error.status,
  //           "Mientras se eliminaba el registro" + error.error[0],
  //           0,
  //           this.toastrService
  //         );
  //       }
  //     )
  //   );
  // }

  editarRegistro(event) {
    this.router.navigate(["../EditarArea", event.data.idArea], {
      relativeTo: this.route,
    });
  }
}
