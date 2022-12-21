import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { NbDialogRef, NbDialogService, NbToastrService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { Subscription } from "rxjs";
import { authService } from "../../../../auth/auth.service";
import { SectorService } from "../../../Catalogos/Sector/sector.service";
import { MensajeEntradaComponent } from "../../../Globales/mensaje-entrada/mensaje-entrada.component";
import { Util } from "../../../Globales/Util";
import { ShowcaseDialogComponent } from "../../../modal-overlays/dialog/showcase-dialog/showcase-dialog.component";
import { DetalleEventoSectorService } from "./detalle-evento-sector.service";

@Component({
  selector: "ngx-asignar-sectores",
  templateUrl: "./asignar-sectores.component.html",
  styleUrls: ["./asignar-sectores.component.scss"],
})
export class AsignarSectoresComponent implements OnInit, OnDestroy {
  @Input() data: any;
  subscripciones: Array<Subscription> = [];

  //Variable que se vuelve true cuando ya existe sectores en ese detalle (para que los siguientes registros se actualicen)
  tablaEsllenadoDB: boolean = false;

  smartSectorTotal: LocalDataSource = new LocalDataSource();
  smartSectoresAsignados: LocalDataSource = new LocalDataSource();
  settingsSectorTotal = {
    mode: "external",
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },

    actions: {
      add: false,

      delete: false,
    },

    pager: {
      display: true,
      perPage: 5,
    },

    columns: {
      desSector: {
        title: "Descripción",
        type: "string",
      },

      anulacion: {
        title: "Estado",
        valuePrepareFunction: (data) => {
          return data ? "Inactivo" : "Activo";
        },
      },
      motivoAnulacion: {
        title: "Motivo",
        type: "string",
      },
    },
  };

  settingsSectoresAsignados = {
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
      desSector: {
        title: "Descripción",
        type: "string",
      },

      anulacion: {
        title: "Estado",
        valuePrepareFunction: (data) => {
          return data ? "Inactivo" : "Activo";
        },
      },
      motivoAnulacion: {
        title: "Motivo",
        type: "string",
      },
    },
  };

  constructor(
    protected ref: NbDialogRef<ShowcaseDialogComponent>,

    private toastrService: NbToastrService,

    private sectorService: SectorService,
    private auth: authService,
    private dialogService: NbDialogService,
    private desService: DetalleEventoSectorService
  ) {}
  ngOnInit(): void {
    this.llenadoSectorTotal();
    this.llenadoSectorAsignado();
  }
  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe());
  }

  public async grabarSectores() {
    //empty vacia el smart
    await this.smartSectoresAsignados
      .getAll()
      .then((lista) => {
        lista.forEach((e) => {
          this.guardarDetalles(e);
        });
      })
      .catch((error) => {
        console.error(error);
        Util.showToast(
          "danger",
          "Error " + error.status,
          "Mientras se obtenian los registros seleccionados " + error.error[0],

          0,
          this.toastrService
        );
      });
  }

  public async actualizarSectores() {
    await this.nuevosElementos.forEach((e) => {
      this.guardarDetalles(e);
    });
    this.nuevosElementos = [];
  }

  public guardarDetalles(e) {
    this.subscripciones.push(
      this.desService
        .guardar({
          detalleEventoId: this.data,
          sectorId: e,
          anulacion: false,
          motivoAnulacion: "",
        })
        .subscribe(
          (r) => {
            Util.showToast(
              "success",
              "Acción realizada",
              "Se ha ingresado el registro",
              4000,
              this.toastrService
            );
            this.tablaEsllenadoDB = true;
            this.listaDetalleSector.push(r);
          },
          (error) => {
            console.error(error);
            Util.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se guardaban los registros " + error.error[0],

              0,
              this.toastrService
            );
          }
        )
    );
  }

  //Arreglo que permitirá que se agreguen nuevos registros en caso de que la tabla de sectores asignado ya tuviera registros existentes
  nuevosElementos = [];
  //Método que valida (si ya existe) cada nuevo sector seleccionado
  public async agregarATablaSectoreslAsignado(elemento) {
    await this.smartSectoresAsignados
      .getAll()
      .then((lista) => {
        //búsqueda en la tabla de sector asignado si ya existe la persona que se selecciona muestra un toast avisando al usuario y no lo agrega a la tabla
        if (lista.find((s) => s.idSector === elemento.data.idSector) == null) {
          this.smartSectoresAsignados.add(elemento.data);
          this.smartSectoresAsignados.refresh();
          //Si la tabla ya poseía registros, significa una actualización, por lo tanto se agregan al arreglo nuevos elementos
          if (this.tablaEsllenadoDB) {
            this.nuevosElementos.push(elemento.data);
          }
        } else
          Util.showToast(
            "warning",
            "Advertencia",
            "Ya está asignado este sector en la tabla",

            8000,
            this.toastrService
          );
      })
      .catch((e) => {
        Util.showToast(
          "danger",
          "Error",
          "Mientras se agregaba el sector se detectó " + e,

          8000,
          this.toastrService
        );
        console.error(e);
      });
  }
  //Se listan todos los sectores en la tabla de sectores totales
  private llenadoSectorTotal(): void {
    this.subscripciones.push(
      this.sectorService.listar().subscribe(
        (resp: any) => {
          this.smartSectorTotal.load(resp);
          this.smartSectorTotal.refresh();
        },
        (error) => {
          console.error(error);
          Util.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban los sectores " + error.error[0],
            0,
            this.toastrService
          );
        }
      )
    );
  }
  listaDetalleSector = [];
  private llenadoSectorAsignado(): void {
    this.subscripciones.push(
      this.desService
        .sectoresPorDetalleEventoId(this.data.idDetalleEvento)
        .subscribe(
          (resp: any) => {
            this.listaDetalleSector = resp;
            resp.forEach((r) => {
              this.smartSectoresAsignados.add(r.sectorId);
              this.tablaEsllenadoDB = true;
            });
            this.smartSectoresAsignados.refresh();
          },
          (error) => {
            console.error(error);
            Util.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se listaban los sectores asignados " + error.error[0],
              0,
              this.toastrService
            );
          }
        )
    );
  }

  public quitar(elemento) {
    if (this.tablaEsllenadoDB) {
      let detalleSector = this.listaDetalleSector.find(
        (e) => e.sectorId.idSector === elemento.data.idSector
      );

      if (detalleSector != null) {
        this.confirmacionAnular(detalleSector);
      } else {
        this.smartSectoresAsignados.remove(elemento.data);
        this.smartSectoresAsignados.refresh();

        let index = this.nuevosElementos.indexOf(elemento.data, 0);
        this.nuevosElementos.splice(index, 1);
      }
    } else {
      this.smartSectoresAsignados.remove(elemento.data);
      this.smartSectoresAsignados.refresh();
    }
  }
  confirmacionAnular(elemento): void {
    let mensaje: string = elemento.anulacion //detalle evento persona
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
              elemento,
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
      this.desService
        .anular(elemento.idDetalleEventoSector, motivoAnulacion)
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

            this.reconstruirDetalleAsignados(elemento, res);
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

  reconstruirDetalleAsignados(elementoAnterior: any, elementoNuevo: any): void {
    let index = this.listaDetalleSector.indexOf(elementoAnterior, 0);
    this.listaDetalleSector.splice(index, 1);

    this.listaDetalleSector.push(elementoNuevo);
  }

  cerrar() {
    this.ref.close();
  }
}
