import { Component, OnInit, OnDestroy } from "@angular/core";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { Subscription } from "rxjs";
import { PersonaService } from "../../persona.service";
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
      cedula: {
        title: "Cédula",
        type: "string",
      },
      pNombre: {
        title: "Primer nombre",
        type: "string",
      },
      sNombre: {
        title: "Segundo nombre",
        type: "string",
      },
      pApellido: {
        title: "Primer apellido",
        type: "string",
      },
      sApellido: {
        title: "Segundo apellido",
        type: "string",
      },
      cargoId: {
        title: "Cargo",
        valuePrepareFunction: (data) => {
          return data.desCargo;
        },
      },

      estado: {
        title: "Estado",
        valuePrepareFunction: (data) => {
          return data ? "Activo" : "Inactivo";
        },
      },
    },
  };

  subscripciones: Array<Subscription> = [];
  //data: any;
  constructor(
    private personaService: PersonaService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  construir(): void {
    this.subscripciones.push(
      this.personaService.listar().subscribe(
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
    if (!id.data.poseeUsuario) {
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
    } else {
      Util.showToast(
        "warning",
        "Atención",
        "No se puede eliminar el personal seleccionado debido que posee una cuenta de usuario",
        4000,
        this.toastrService
      );
    }
  }
  eliminar(id): void {
    this.subscripciones.push(
      this.personaService.eliminar(id.idPersona).subscribe(
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
    this.router.navigate(["../EditarPersona", event.data.idPersona], {
      relativeTo: this.route,
    });
  }
}
