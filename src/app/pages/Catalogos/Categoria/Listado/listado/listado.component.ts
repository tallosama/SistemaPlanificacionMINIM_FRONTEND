import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import {
  NbDialogService,
  NbGlobalPhysicalPosition,
  NbToastrService,
} from "@nebular/theme";
import { DialogNamePromptComponent } from "../../../../modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component";
import { Subject, Subscription } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { CategoriaService } from "../../categoria.service";
import { LocalDataSource } from "ng2-smart-table";
import { ActivatedRoute, Router } from "@angular/router";
import { Control } from "../../../../Globales/Control";

@Component({
  selector: "ngx-listado",
  templateUrl: "./listado.component.html",
  styleUrls: ["./listado.component.scss"],
})
export class ListadoComponent implements OnInit, OnDestroy {
  // @ViewChild(DataTableDirective, { static: false })
  // dtElement: DataTableDirective;
  // dtOptions: DataTables.Settings = {};
  // dtTrigger = new Subject();
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
      descripCategoria: {
        title: "Descripción",
        type: "string",
      },
    },
  };

  subscripciones: Array<Subscription> = [];
  //data: any;
  constructor(
    private categoriaService: CategoriaService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  construir(): void {
    this.subscripciones.push(
      this.categoriaService.listar().subscribe(
        (resp: any) => {
          this.sourceSmart.load(resp);
          // this.data = resp;
          // this.dtTrigger.next();
        },
        (error) => {
          console.error(error);
          this.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban los registros" +
              Control.evaluarErrorDependiente(error.error),
            0
          );
        }
      )
    );
  }

  reconstruir(id: any): void {
    this.sourceSmart.remove(id);
    this.sourceSmart.refresh();

    // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   // Primero destruimos la instancia de la datatable
    //   dtInstance.destroy();
    //   //Obtenemos el índice del elemento a eliminar y lo eliminamos de this.data
    //   this.data.splice(this.data.indexOf(id), 1); // 1 es la cantidad de elemento a eliminar
    //   //reconstrucción de la datatables con los nevos elementos
    //   this.dtTrigger.next();
    // });
  }

  ngOnInit(): void {
    this.construir();
    //datatables
    // this.dtOptions = {
    //   pagingType: "full_numbers",
    //   pageLength: 10,
    //   destroy: true,
    //   language: {
    //     url: "//cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json",
    //   },
    // };
  }
  ngOnDestroy(): void {
    this.subscripciones.forEach((subs) => subs.unsubscribe());
    // this.dtTrigger.unsubscribe();
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
      this.categoriaService.eliminar(id.idCategoria).subscribe(
        (res) => {
          if (res) {
            this.showToast(
              "success",
              "Acción realizada",
              "Se ha eliminado el registro",
              4000
            );
          } else {
            this.showToast(
              "warning",
              "Atención",
              "No se ha encontrado el registro",
              4000
            );
          }
          this.reconstruir(id);
        },
        (error) => {
          console.error(error);
          this.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se eliminaba el registro" +
              Control.evaluarErrorDependiente(error.error),
            0
          );
        }
      )
    );
  }
  editarRegistro(event) {
    this.router.navigate(["../EditarCategoria", event.data.idCategoria], {
      relativeTo: this.route,
    });
  }
  //construccion del mensaje
  public showToast(
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
