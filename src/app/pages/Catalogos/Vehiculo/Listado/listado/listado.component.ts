import { Component, OnInit, ViewChild } from "@angular/core";
import { VehiculoService } from "../../vehiculo.service";
import { Subject, Subscription } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import {
  NbDialogService,
  NbGlobalPhysicalPosition,
  NbToastrService,
} from "@nebular/theme";
import { DialogNamePromptComponent } from "../../../../modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component";
import { ActivatedRoute, Router } from "@angular/router";
import { LocalDataSource } from "ng2-smart-table";

@Component({
  selector: "ngx-listado",
  templateUrl: "./listado.component.html",
  styleUrls: ["./listado.component.scss"],
})
export class ListadoComponent implements OnInit {
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
      desVehiculo: {
        title: "Descripción",
        type: "string",
      },
      placa: {
        title: "Placa",
        type: "string",
      },
      modelo: {
        title: "Modelo",
        type: "string",
      },
      marca: {
        title: "Marca",
        type: "string",
      },
      estado: {
        title: "Estado",
        type: "string",
      },
    },
  };
  constructor(
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    public vehiculoService: VehiculoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  construir(): void {
    this.subscripciones.push(
      this.vehiculoService.listar().subscribe(
        (resp: any) => {
          this.sourceSmart.load(resp);
        },
        (error) => {
          console.error(error);
          this.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban los registros" + error.error[0],

            0
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
      this.vehiculoService.eliminar(id.idVehiculo).subscribe(
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
            "Mientras se eliminaba el registro" + error.error[0],

            0
          );
        }
      )
    );
  }
  editarRegistro(event) {
    this.router.navigate(["../EditarVehiculo", event.data.idVehiculo], {
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
