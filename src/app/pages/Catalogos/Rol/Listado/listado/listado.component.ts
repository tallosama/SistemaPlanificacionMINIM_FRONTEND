import { Component, OnDestroy, OnInit } from "@angular/core";
import { RolService } from "../../rol.service";
import { Subscription } from "rxjs";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { DialogNamePromptComponent } from "../../../../modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component";
import { LocalDataSource } from "ng2-smart-table";
import { ActivatedRoute, Router } from "@angular/router";
import { Util } from "../../../../Globales/Util";

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
      desRol: {
        title: "Descripción",
        type: "string",
      },
    },
  };
  constructor(
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private rolService: RolService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  //para datatables
  construir(): void {
    this.subscripciones.push(
      this.rolService.listar().subscribe(
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

  reconstruir(id: any): void {
    this.sourceSmart.remove(id);
    this.sourceSmart.refresh();
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

  eliminar(id): void {
    this.subscripciones.push(
      this.rolService.eliminar(id.idRol).subscribe(
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
          this.reconstruir(id);
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
    this.router.navigate(["../EditarRol", event.data.idRol], {
      relativeTo: this.route,
    });
  }
}
