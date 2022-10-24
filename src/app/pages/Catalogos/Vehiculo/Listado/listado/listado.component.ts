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

@Component({
  selector: "ngx-listado",
  templateUrl: "./listado.component.html",
  styleUrls: ["./listado.component.scss"],
})
export class ListadoComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  subscripciones: Array<Subscription> = [];
  data: any;
  constructor(
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    public vehiculoService: VehiculoService
  ) {}

  construir(): void {
    this.subscripciones.push(
      this.vehiculoService.listar().subscribe(
        (resp: any) => {
          this.data = resp;
          this.dtTrigger.next();
        },
        (error) => {
          console.error(error);
          this.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban los registros" + error.message,
            0
          );
        }
      )
    );
  }
  reconstruir(id: any): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Primero destruimos la instancia de la datatable
      dtInstance.destroy();
      //Obtenemos el índice del elemento a eliminar y lo eliminamos de this.data
      this.data.splice(this.data.indexOf(id), 1); // 1 es la cantidad de elemento a eliminar
      //reconstrucción de la datatables con los nevos elementos
      this.dtTrigger.next();
    });
  }
  ngOnInit(): void {
    this.construir();
    //datatables
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      destroy: true,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json",
      },
    };
  }
  ngOnDestroy(): void {
    this.subscripciones.forEach((subs) => subs.unsubscribe());
    this.dtTrigger.unsubscribe();
  }
  confirmacion(id): void {
    this.subscripciones.push(
      this.dialogService
        .open(DialogNamePromptComponent, {
          context: {
            titulo: "¿Desea elminar el registro?",
          },
        })
        .onClose.subscribe((res) => {
          if (res) {
            this.eliminar(id);
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
            "Mientras se eliminaba el registro " + error.message,
            0
          );
        }
      )
    );
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
