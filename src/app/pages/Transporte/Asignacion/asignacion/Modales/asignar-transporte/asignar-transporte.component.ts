import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { NbDialogRef, NbDialogService, NbToastrService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { Subscription } from "rxjs-compat";
import { authService } from "../../../../../../auth/auth.service";
import { VehiculoService } from "../../../../../Catalogos/Vehiculo/vehiculo.service";
import { Util } from "../../../../../Globales/Util";
import { ShowcaseDialogComponent } from "../../../../../modal-overlays/dialog/showcase-dialog/showcase-dialog.component";
import { RequerimientosService } from "../../../../../Requerimientos/requerimientos.service";
import { TransporteService } from "../../../../transporte.service";

@Component({
  selector: "ngx-asignar-transporte",
  templateUrl: "./asignar-transporte.component.html",
  styleUrls: ["./asignar-transporte.component.scss"],
})
export class AsignarTransporteComponent implements OnInit, OnDestroy {
  @Input() requerimiento: any;
  subscripciones: Array<Subscription> = [];
  fecha = new Date().toISOString().slice(0, 10);
  usuario;
  elementosSeleccionados = [];
  smartTransporteTotales: LocalDataSource = new LocalDataSource();
  settingsTransporteTotal = {
    mode: "external",
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },

    actions: {
      add: false,
      edit: false,
      delete: false,
    },

    pager: {
      display: true,
      perPage: 5,
    },
    selectMode: "multi",
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
    },
  };

  constructor(
    protected ref: NbDialogRef<ShowcaseDialogComponent>,
    private vehiculoService: VehiculoService,
    private transporteService: TransporteService,
    private toastrService: NbToastrService,
    private auth: authService,
    private requerimientoService: RequerimientosService
  ) { }

  ngOnInit(): void {
    this.usuario = this.auth.getUserStorage();
    this.cargarVehiculos();
  }
  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe());
  }

  agregarArreglo(elementos) {
    this.elementosSeleccionados = elementos.selected;
  }
  public guardar() {

    // this.elementosSeleccionados.forEach((v) => {
    //   this.subscripciones.push(
    //     this.transporteService
    //       .guardar({
    //         anulacion: false,
    //         motivoAnulacion: "",
    //         vehiculoId: v,
    //         requerimientoId: this.requerimiento,
    //         usuarioCreacion: this.usuario.uid,
    //         usuarioModificacion: this.usuario.uid,
    //         fechaCreacion: this.fecha,
    //         fechaModificacion: this.fecha,
    //       })
    //       .subscribe(
    //         (r) => {
    //           // Util.showToast(
    //           //   "success",
    //           //   "Acción realizada",
    //           //   "Se ha asignado el vehículo",
    //           //   4000,
    //           //   this.toastrService
    //           // );
    //           Util.showToast(
    //             "success",
    //             "Acción realizada",
    //             "1",
    //             4000,
    //             this.toastrService
    //           );
    //           this.cambiarEstadoVehiculo(v);
    //         },
    //         (error) => {
    //           console.error(error);
    //           Util.showToast(
    //             "danger",
    //             "Error " + error.status,
    //             "Mientras se ingresaban el/los registros " + error.error[0],
    //             0,
    //             this.toastrService
    //           );
    //         }
    //       )
    //   );
    // });
    //this.cambiarEstadoRequerimiento();

    this.elementosSeleccionados.forEach(async (v) => {
      await this.transporteService
        .guardar({
          anulacion: false,
          motivoAnulacion: "",
          vehiculoId: v,
          requerimientoId: this.requerimiento,
          usuarioCreacion: this.usuario.uid,
          usuarioModificacion: this.usuario.uid,
          fechaCreacion: this.fecha,
          fechaModificacion: this.fecha,
        }).toPromise().then(r => {
          // Util.showToast(
          //   "success",
          //   "Acción realizada",
          //   "Se ha asignado el vehículo",
          //   4000,
          //   this.toastrService
          // );
          this.cambiarEstadoVehiculo(v);
        }
        ).catch((error) => {
          console.error(error);
          Util.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se ingresaban el/los registros " + error.error[0],
            0,
            this.toastrService
          );
        });
    });
    this.cambiarEstadoRequerimiento();

  }
  private cargarVehiculos(): void {
    this.subscripciones.push(
      this.vehiculoService.listarActivosDisponibles().subscribe(
        (resp) => {
          this.smartTransporteTotales.load(resp);
          this.smartTransporteTotales.refresh();
        },
        (error) => {
          console.error(error);
          Util.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban los vehículos " + error.error[0],

            0,
            this.toastrService
          );
        }
      )
    );
  }

  private async cambiarEstadoVehiculo(vehiculo: any) {

    vehiculo["estado"] = false;


    await this.vehiculoService.editar(vehiculo.idVehiculo, vehiculo)
      .toPromise().then((r) => {

        Util.showToast(
          "success",
          "Acción realizada",
          "Se ha cambiado el estado al vehículo",
          4000,
          this.toastrService
        );
      },).catch((error) => {
        console.error(error);
        Util.showToast(
          "danger",
          "Error " + error.status,
          "Mientras se cambiaba el estado al vehículo " + error.error[0],

          0,
          this.toastrService
        );
      });


    // this.subscripciones.push(
    //   this.vehiculoService.editar(vehiculo.idVehiculo, vehiculo).subscribe(
    //     (r) => {
    //       Util.showToast(
    //         "success",
    //         "Acción realizada",
    //         "2",
    //         4000,
    //         this.toastrService
    //       );
    //       // Util.showToast(
    //       //   "success",
    //       //   "Acción realizada",
    //       //   "Se ha cambiado el estado al vehículo",
    //       //   4000,
    //       //   this.toastrService
    //       // );
    //     },
    //     (error) => {
    //       console.error(error);
    //       Util.showToast(
    //         "danger",
    //         "Error " + error.status,
    //         "Mientras se cambiaba el estado al vehículo " + error.error[0],

    //         0,
    //         this.toastrService
    //       );
    //     }
    //   )
    // );
  }
  private cambiarEstadoRequerimiento() {
    this.requerimiento["estado"] = "Asignado";

    this.subscripciones.push(
      this.requerimientoService
        .editar(this.requerimiento.idRequerimiento, this.requerimiento)
        .subscribe(
          (r) => {
            this.cerrar(true);
          },
          (error) => {
            console.error(error);
            Util.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se cambiaba el estado al requerimiento " +
              error.error[0],

              0,
              this.toastrService
            );
          }
        )
    );
  }

  public cerrar(esCompletado: boolean = false): void {
    this.ref.close(esCompletado);
  }
}
