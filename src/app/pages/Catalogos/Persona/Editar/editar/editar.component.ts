import { Component, OnDestroy, OnInit } from "@angular/core";
import { PersonaService } from "../../persona.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbToastrService } from "@nebular/theme";
import { Subscription } from "rxjs";
import { authService } from "../../../../../auth/auth.service";
import { CargoService } from "../../../Cargo/cargo.service";
import { Util } from "../../../../Globales/Util";

@Component({
  selector: "ngx-editar",
  templateUrl: "./editar.component.html",
  styleUrls: ["./editar.component.scss"],
})
export class EditarComponent implements OnInit, OnDestroy {
  fecha = new Date().toISOString().slice(0, 10);
  personaForm: FormGroup;
  id: number;
  estado = [
    { esActivo: true, Estado: "Activo" },
    { esActivo: false, Estado: "Inactivo" },
  ];
  cargos: any;
  subscripciones: Array<Subscription> = [];
  constructor(
    public fb: FormBuilder,
    private router: Router,
    public personaService: PersonaService,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
    public cargoService: CargoService,
    public auth: authService
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
            "Mientras se listaban los cargos " + error.error[0],

            0,
            this.toastrService
          );
        }
      )
    );
  }
  ngOnInit(): void {
    this.llenadoCombobox();
    this.id = this.route.snapshot.params["id"];
    this.cargarForm(this.auth.getUserStorage());
  }
  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe());
  }
  private cargarForm(usuario) {
    this.subscripciones.push(
      this.personaService.buscar(this.id).subscribe(
        (res) => {
          this.personaForm = this.fb.group({
            cedula: [
              res.cedula,
              Validators.compose([
                Validators.required,
                Validators.minLength(16),
                Validators.maxLength(50),
                Util.esVacio,
              ]),
            ],
            pNombre: [
              res.pNombre,
              Validators.compose([
                Validators.required,
                Validators.maxLength(32),
                Util.esVacio,
              ]),
            ],
            sNombre: [res.sNombre, Validators.maxLength(32)],
            pApellido: [
              res.pApellido,
              Validators.compose([
                Validators.required,
                Validators.maxLength(32),
                Util.esVacio,
              ]),
            ],
            sApellido: [res.sApellido, Validators.maxLength(32)],

            poseeUsuario: [res.poseeUsuario, Validators.required],
            estado: [res.estado, Validators.required],
            cargoId: [
              this.cargos.find((c) => c.idCargo == res.cargoId.idCargo),
              Validators.required,
            ],

            usuarioModificacion: [usuario.uid, Validators.required],
            fechaModificacion: [this.fecha, Validators.required],
          });
        },
        (error) => {
          console.error(error);
          Util.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se buscaba un registro" + error.error[0],

            0,
            this.toastrService
          );
        }
      )
    );
  }

  public editar(): void {
    this.subscripciones.push(
      this.personaService
        .editar(this.id, Util.limpiarForm(this.personaForm.value))
        .subscribe(
          (resp) => {
            this.router.navigate(["../../ListarPersona"], {
              relativeTo: this.route,
            });
            Util.showToast(
              "success",
              "Acción realizada",
              "Se ha editado el registro",
              4000,
              this.toastrService
            );
          },
          (error) => {
            console.error(error);
            Util.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se editaba un registro" + error.error[0],

              0,
              this.toastrService
            );
          }
        )
    );
  }
}
