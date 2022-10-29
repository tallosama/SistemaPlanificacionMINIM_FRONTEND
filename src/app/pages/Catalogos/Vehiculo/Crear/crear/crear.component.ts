import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  NbGlobalPhysicalPosition,
  NbToastrService,
  NbToastrConfig,
} from "@nebular/theme";
import { VehiculoService } from "../../vehiculo.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { authService } from "../../../../../auth/auth.service";

@Component({
  selector: "ngx-crear",
  templateUrl: "./crear.component.html",
  styleUrls: ["./crear.component.scss"],
})
export class CrearComponent implements OnInit, OnDestroy {
  fecha = new Date().toISOString().slice(0, 10);
  vehiculoForm: FormGroup;
  config: NbToastrConfig;

  subscripciones: Array<Subscription> = [];
  constructor(
    public fb: FormBuilder,
    public vehiculoService: VehiculoService,
    private toastrService: NbToastrService,
    private auth: authService
  ) {}

  ngOnInit(): void {
    this.cargarForm(this.auth.getUserStorage());
  }

  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe);
  }
  private cargarForm(usuario) {
    this.vehiculoForm = this.fb.group({
      desVehiculo: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(512),
          this.noWhitespaceValidator,
        ]),
      ],
      placa: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(32),
          this.noWhitespaceValidator,
        ]),
      ],
      modelo: ["", Validators.maxLength(32)],
      marca: ["", Validators.maxLength(32)],
      estado: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(32)]),
      ],
      usuarioCreacion: [usuario.uid, Validators.required],
      fechaCreacion: [this.fecha, Validators.required],
      usuarioModificacion: [usuario.uid, Validators.required],
      fechaModificacion: [this.fecha, Validators.required],
    });
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  limpiar(): void {
    this.vehiculoForm.get("desVehiculo").reset();
    this.vehiculoForm.get("placa").reset();
    this.vehiculoForm.get("modelo").reset();
    this.vehiculoForm.get("marca").reset();
    this.vehiculoForm.get("estado").reset();
  }

  guardar(): void {
    this.subscripciones.push(
      this.vehiculoService.guardar(this.vehiculoForm.value).subscribe(
        (resp) => {
          this.showToast(
            "success",
            "Acción realizada",
            "Se ha ingresado el registro",
            4000
          );

          this.limpiar();
        },
        (error) => {
          console.error(error);
          this.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se ingresaba un registro " + error.message,
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
