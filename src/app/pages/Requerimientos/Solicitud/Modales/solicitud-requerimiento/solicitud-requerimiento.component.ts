import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbDialogRef, NbDialogService, NbToastrService } from "@nebular/theme";
import { Subscription } from "rxjs-compat";
import { authService } from "../../../../../auth/auth.service";
import { ProductoService } from "../../../../Catalogos/Producto/producto.service";
import { VehiculoService } from "../../../../Catalogos/Vehiculo/vehiculo.service";
import { Util } from "../../../../Globales/Util";
import { ShowcaseDialogComponent } from "../../../../modal-overlays/dialog/showcase-dialog/showcase-dialog.component";
import { RequerimientosService } from "../../../requerimientos.service";

@Component({
  selector: "ngx-solicitud-requerimiento",
  templateUrl: "./solicitud-requerimiento.component.html",
  styleUrls: ["./solicitud-requerimiento.component.scss"],
})
export class SolicitudRequerimientoComponent implements OnInit, OnDestroy {
  @Input() detalleEvento: any;
  fecha = new Date().toISOString().slice(0, 10);
  requerimientoForm: FormGroup;
  subscripciones: Array<Subscription> = [];
  tipos = ["Material", "Equipo", "Transporte"];
  //keywords = ["descripcion","tipo"];
  keyword = "descripcion";
  data = [];
  constructor(
    protected ref: NbDialogRef<ShowcaseDialogComponent>,
    private toastrService: NbToastrService,
    public fb: FormBuilder,
    private auth: authService,
    private dialogService: NbDialogService,
    private requerimientosService: RequerimientosService,
    private productoService: ProductoService,
    private vehiculoService: VehiculoService
  ) {}

  ngOnInit(): void {
    this.cargarForm(this.auth.getUserStorage());
  }
  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe());
  }

  reconstruirAutoCompletado(tipo): void {
    if (tipo === "Material") {
      this.keyword = "descripcion";
      this.reconstruirDatos(this.productoService);
      // this.subscripciones.push(
      //   this.productoService.listar().subscribe(
      //     (resp) => {
      //       this.data = resp;
      //       console.log(resp);
      //     },
      //     (error) => {
      //       console.error(error);
      //       Util.showToast(
      //         "danger",
      //         "Error " + error.status,
      //         "Mientras se listaban los materiales " + error.error[0],

      //         0,
      //         this.toastrService
      //       );
      //     }
      //   )
      // );
    } else if (tipo === "Transporte") {
      this.keyword = "desVehiculo";
      this.reconstruirDatos(this.vehiculoService);
    } else {
    }
  }

  private reconstruirDatos(service): void {
    this.subscripciones.push(
      service.listar().subscribe(
        (resp) => {
          this.data = resp;
          console.log(resp);
        },
        (error) => {
          console.error(error);
          Util.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban los autocompletados " + error.error[0],

            0,
            this.toastrService
          );
        }
      )
    );
  }
  cargarForm(user): void {
    this.requerimientoForm = this.fb.group({
      desRequerimiento: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(512)]),
      ],
      cantidadSolicitada: ["0", Validators.required],
      cantidadAprobada: ["0", Validators.required],
      tipoRequerimiento: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(32)]),
      ],
      estado: [
        "Solicitado",
        Validators.compose([Validators.required, Validators.maxLength(32)]),
      ],
      anulacion: [false, Validators.required],
      motivoAnulacion: [""],
      detalleEventoId: [this.detalleEvento, Validators.required],
      usuarioCreacion: [user.uid, Validators.required],
      fechaCreacion: [this.fecha, Validators.required],
      usuarioModificacion: [user.uid, Validators.required],
      fechaModificacion: [this.fecha, Validators.required],
    });
  }
  guardar(): void {
    this.subscripciones.push(
      this.requerimientosService
        .guardar(Util.limpiarForm(this.requerimientoForm.value))
        .subscribe(
          () => {
            Util.showToast(
              "success",
              "Acción realizada",
              "Se ha ingresado el registro",
              4000,
              this.toastrService
            );
            //this.limpiar();
            //this.cerrar(true);
          },
          (error) => {
            console.error(error);
            Util.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se realizaba un registro " + error.error[0],
              0,
              this.toastrService
            );
          }
        )
    );
  }

  cerrar() {
    this.ref.close();
  }
}
