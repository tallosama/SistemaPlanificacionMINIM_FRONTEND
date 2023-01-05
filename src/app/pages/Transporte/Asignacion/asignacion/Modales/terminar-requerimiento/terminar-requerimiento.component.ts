import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { NbDialogRef, NbToastrService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { Subscription } from "rxjs-compat";
import { authService } from "../../../../../../auth/auth.service";
import { VehiculoService } from "../../../../../Catalogos/Vehiculo/vehiculo.service";
import { Util } from "../../../../../Globales/Util";
import { ShowcaseDialogComponent } from "../../../../../modal-overlays/dialog/showcase-dialog/showcase-dialog.component";
import { RequerimientosService } from "../../../../../Requerimientos/requerimientos.service";
import { TransporteService } from "../../../../transporte.service";

@Component({
  selector: "ngx-terminar-requerimiento",
  templateUrl: "./terminar-requerimiento.component.html",
  styleUrls: ["./terminar-requerimiento.component.scss"],
})
export class TerminarRequerimientoComponent implements OnInit, OnDestroy {
  @Input() requerimiento: any;
  subscripciones: Array<Subscription> = [];
  fecha = new Date().toISOString().slice(0, 10);
  usuario;
  elementosSeleccionados = [];
  smartTransportes: LocalDataSource = new LocalDataSource();
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
    this.elementosSeleccionados.forEach((t) => {
      this.cambiarEstadoVehiculo(t);
    });
    this.cambiarEstadoRequerimiento();
  }
  private cargarVehiculos(): void {
    this.subscripciones.push(
      this.transporteService
        .listarActivosPorRequerimiento(this.requerimiento.idRequerimiento)
        .subscribe(
          (resp) => {
            resp.forEach((r) => {
              this.smartTransportes.add(r.vehiculoId);
            });

            this.smartTransportes.refresh();
          },
          (error) => {
            console.error(error);
            Util.showToast("danger", "Error " + error.status, "Mientras se listaban los transportes asignados " + error.error[0], 0, this.toastrService);
          }
        )
    );
  }

  private cambiarEstadoVehiculo(vehiculo: any) {
    vehiculo["estado"] = true;

    this.subscripciones.push(
      this.vehiculoService.editar(vehiculo.idVehiculo, vehiculo).subscribe(
        () => { },
        (error) => {
          console.error(error);
          Util.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se cambiaba el estado al vehículo " + error.error[0],

            0,
            this.toastrService
          );
        }
      )
    );
  }
  private cambiarEstadoRequerimiento() {
    this.requerimiento["estado"] = "Terminado";

    this.subscripciones.push(
      this.requerimientoService
        .editar(this.requerimiento.idRequerimiento, this.requerimiento)
        .subscribe(
          () => {
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
