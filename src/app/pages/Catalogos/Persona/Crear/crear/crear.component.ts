import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbToastrService } from "@nebular/theme";
import { PersonaService } from "../../persona.service";
import { Subscription } from "rxjs";
import { authService } from "../../../../../auth/auth.service";
import { CargoService } from "../../../Cargo/cargo.service";
import { Util } from "../../../../Globales/Util";

@Component({
  selector: "ngx-crear",
  templateUrl: "./crear.component.html",
  styleUrls: ["./crear.component.scss"],
})
export class CrearComponent implements OnInit, OnDestroy {
  fecha = new Date().toISOString().slice(0, 10);
  personaForm: FormGroup;
  estado = [
    { esActivo: true, Estado: "Activo" },
    { esActivo: false, Estado: "Inactivo" },
  ];
  cargos: any;
  subscripciones: Array<Subscription> = [];
  constructor(
    private toastrService: NbToastrService,
    public fb: FormBuilder,
    public personaService: PersonaService,
    public cargoService: CargoService,
    private auth: authService
  ) {}

  private llenadoCombobox(): void {
    this.subscripciones.push(
      this.cargoService.listar().subscribe(
        (resp) => {
          this.cargos = resp;
        },
        (error) => {
          console.error(error);
          Util.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban los cargos" + error.error[0],

            0,
            this.toastrService
          );
        }
      )
    );
  }
  ngOnInit(): void {
    this.llenadoCombobox();
    this.cargarForm(this.auth.getUserStorage());
  }
  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe);
  }
  cargarForm(usuario) {
    this.personaForm = this.fb.group({
      cedula: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(14),
          Validators.maxLength(50),
          Util.esVacio,
        ]),
      ],
      pNombre: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(32),
          Util.esVacio,
        ]),
      ],
      sNombre: ["", Validators.maxLength(32)],
      pApellido: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(32),
          Util.esVacio,
        ]),
      ],
      sApellido: ["", Validators.maxLength(32)],
      poseeUsuario: [false, Validators.required],
      cargoId: ["", Validators.required],
      estado: [this.estado[0].esActivo, Validators.required],

      usuarioCreacion: [usuario.uid, Validators.required],
      fechaCreacion: [this.fecha, Validators.required],
      usuarioModificacion: [usuario.uid, Validators.required],
      fechaModificacion: [this.fecha, Validators.required],
    });
  }

  limpiar(): void {
    this.personaForm.get("cedula").reset();
    this.personaForm.get("pNombre").reset();
    this.personaForm.get("sNombre").reset();
    this.personaForm.get("pApellido").reset();
    this.personaForm.get("sApellido").reset();
  }

  guardar(): void {
    this.personaForm
      .get("cedula")
      .setValue(Util.aplicarMascaraCedula(this.personaForm.value.cedula));

    this.subscripciones.push(
      this.personaService
        .guardar(Util.limpiarForm(this.personaForm.value))
        .subscribe(
          (resp) => {
            Util.showToast(
              "success",
              "Acción realizada",
              "Se ha ingresado el registro",
              4000,
              this.toastrService
            );

            this.limpiar();
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
}
