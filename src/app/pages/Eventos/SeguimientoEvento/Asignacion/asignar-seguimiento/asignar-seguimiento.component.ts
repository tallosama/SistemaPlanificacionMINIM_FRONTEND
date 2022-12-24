import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbDialogRef, NbToastrService } from "@nebular/theme";
import { Subscription } from "rxjs";
import { authService } from "../../../../../auth/auth.service";
import { Util } from "../../../../Globales/Util";
import { ShowcaseDialogComponent } from "../../../../modal-overlays/dialog/showcase-dialog/showcase-dialog.component";
import { DetalleEventoService } from "../../../detalle-evento.service";
import { SeguimientoEventoService } from "../../../seguimiento-evento/seguimiento-evento.service";

@Component({
  selector: "ngx-asignar-seguimiento",
  templateUrl: "./asignar-seguimiento.component.html",
  styleUrls: ["./asignar-seguimiento.component.scss"],
})
export class AsignarSeguimientoComponent implements OnInit, OnDestroy {
  //@ViewChild("cantMujeres", { static: true }) mujeres: ElementRef; //Son estáticos porque los elementos originales del html no dependen de un IF
  //@ViewChild("participantesReales") total: ElementRef;
  @Input() detalleEvento: any;
  fecha = new Date().toISOString().slice(0, 10);
  asignacionForm: FormGroup;
  subscripcion: Array<Subscription> = [];
  constructor(
    protected ref: NbDialogRef<ShowcaseDialogComponent>,
    public fb: FormBuilder,
    private toastrService: NbToastrService,
    private auth: authService,
    private seguimientoService: SeguimientoEventoService,
    private detalleService: DetalleEventoService
  ) {}

  ngOnInit(): void {
    this.cargarForm(this.auth.getUserStorage());
  }
  ngOnDestroy(): void {
    this.subscripcion.forEach((s) => s.unsubscribe());
  }
  // limpiar(): void {
  //   this.asignacionForm.get("resultados").reset();
  //   this.asignacionForm.get("incidencias").reset();
  //   this.asignacionForm.get("participantesReal").setValue(0);
  //   this.asignacionForm.get("cantMujeres").setValue(0);
  //   this.asignacionForm.get("cantVarones").setValue(0);
  // }
  cargarForm(user): void {
    this.asignacionForm = this.fb.group({
      resultados: ["", Validators.maxLength(1024)],

      incidencias: ["", Validators.maxLength(1024)],

      participantesReal: ["0", Validators.required],

      cantMujeres: ["0", Validators.required],

      cantVarones: ["0", Validators.required],

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
    this.subscripcion.push(
      this.seguimientoService
        .guardar(Util.limpiarForm(this.asignacionForm.value))
        .subscribe(
          () => {
            this.cambiarEstadoAlDetalle();
            //this.limpiar();
            this.cerrar(true);
          },
          (error) => {
            console.error(error);
            Util.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se realizaba un registro" + error.error[0],
              0,
              this.toastrService
            );
          }
        )
    );
  }

  public actualizarTotal(): void {
    let valorMujeres = this.asignacionForm.get("cantMujeres").value * 1;
    let valorHombres = this.asignacionForm.get("cantVarones").value * 1;
    this.asignacionForm
      .get("participantesReal")
      .setValue(valorMujeres + valorHombres);
  }
  private cambiarEstadoAlDetalle(): void {
    let estado: string = "Realizada";
    this.subscripcion.push(
      this.detalleService
        .cambiarEstado(this.detalleEvento.idDetalleEvento, estado)
        .subscribe(
          () => {
            Util.showToast(
              "success",
              "Acción realizada",
              "Se ha cambiado el estado al detalle de evento ",
              4000,
              this.toastrService
            );
          },
          (error) => {
            console.error(error);
            Util.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se cambiaba el estado al detalle de evento " +
                error.error[0],
              0,
              this.toastrService
            );
          }
        )
    );
  }
  cerrar(esGuardado: boolean = false) {
    this.ref.close(esGuardado);
  }
}
