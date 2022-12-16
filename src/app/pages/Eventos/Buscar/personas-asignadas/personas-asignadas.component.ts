import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NbDialogRef, NbToastrService } from "@nebular/theme";
import { AutocompleteComponent } from "angular-ng-autocomplete";
import { LocalDataSource } from "ng2-smart-table";
import { Subscription } from "rxjs";
import { AreaService } from "../../../Catalogos/Area/area.service";
import { PersonaService } from "../../../Catalogos/Persona/persona.service";

import { Util } from "../../../Globales/Util";
import { ShowcaseDialogComponent } from "../../../modal-overlays/dialog/showcase-dialog/showcase-dialog.component";
import { detalleEventoPersonaPersonaService } from "./detalle-evento-persona.service";

@Component({
  selector: "ngx-personas-asignadas",
  templateUrl: "./personas-asignadas.component.html",
  styleUrls: ["./personas-asignadas.component.scss"],
})
export class PersonasAsignadasComponent implements OnInit, OnDestroy {
  @Input() data: any;
  subscripciones: Array<Subscription> = [];
  areas: any = [];
  personasAsignadas: any = [];

  keyword = "desArea";

  smartPersonalTotal: LocalDataSource = new LocalDataSource();
  smartPersonalAsignado: LocalDataSource = new LocalDataSource();

  settingsPersonalTotal = {
    mode: "external",
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    // delete: {
    //   deleteButtonContent: '<i class="nb-trash"></i>',
    // },
    actions: {
      add: false,

      delete: false,
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

      pApellido: {
        title: "Primer apellido",
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

  settingsPersonalAsignado = {
    mode: "external",

    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
    },
    actions: {
      add: false,
      edit: false,
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

      pApellido: {
        title: "Primer apellido",
        type: "string",
      },

      cargoId: {
        title: "Cargo",
        valuePrepareFunction: (data) => {
          console.log(data);

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

  constructor(
    protected ref: NbDialogRef<ShowcaseDialogComponent>,
    private personaService: PersonaService,
    private toastrService: NbToastrService,
    private areaService: AreaService,
    private depService: detalleEventoPersonaPersonaService
  ) {}
  ngOnInit(): void {
    this.llenadoListas();

    this.llenadoTablaPersonaAsignada();
  }
  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe());
  }
  public llenadoTablaPersonaAsignada() {
    this.subscripciones.push(
      this.depService
        .listarPorDetalleEvento(this.data.idDetalleEvento)
        .subscribe(
          (resp) => {
            console.log(resp);

            //this.smartPersonalAsignado.load();
            resp.forEach((r) => {
              this.smartPersonalAsignado.add(r.personaId);
            });
            this.smartPersonalAsignado.refresh();
          },
          (error) => {
            console.error(error);
            Util.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se listaban las personas asignadas " + error.error[0],

              0,
              this.toastrService
            );
          }
        )
    );
  }

  public async agregar(elemento) {
    console.log("Arreglar el find");

    console.log(elemento.data);
    // await this.smartPersonalAsignado
    //   .find(elemento.data)
    //   .then((r) => {
    //     if (r == null) {
    //       this.smartPersonalAsignado.add(elemento.data);
    //       this.smartPersonalAsignado.refresh();
    //     }
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     Util.showToast(
    //       "danger",
    //       "Error " + error.status,
    //       "Mientras se agregaba a la tabla el personal " + error,

    //       0,
    //       this.toastrService
    //     );
    //   });
  }
  public quitar(elemento) {
    console.log(elemento);
  }

  public llenadoListas() {
    this.subscripciones.push(
      this.areaService.listar().subscribe(
        (resp) => {
          this.areas = resp;
        },
        (error) => {
          console.error(error);
          Util.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban las áreas " + error.error[0],

            0,
            this.toastrService
          );
        }
      )
    );
  }
  public reconstruir(area) {
    this.subscripciones.push(
      this.personaService.listarPorArea(area.idArea).subscribe(
        (resp: any) => {
          this.smartPersonalTotal.load(resp);
          this.smartPersonalTotal.refresh();
        },
        (error) => {
          console.error(error);
          Util.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaba el personal " + error.error[0],
            0,
            this.toastrService
          );
        }
      )
    );
  }
  public confirmacion(event) {}
  cerrar() {
    this.ref.close();
  }
}
