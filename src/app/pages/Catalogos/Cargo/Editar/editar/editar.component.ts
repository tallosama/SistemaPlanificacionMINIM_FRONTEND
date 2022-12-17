import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NbToastrService } from "@nebular/theme";
import { Subscription } from "rxjs";
import { authService } from "../../../../../auth/auth.service";
import { Util } from "../../../../Globales/Util";
import { AreaService } from "../../../Area/area.service";
import { CargoService } from "../../cargo.service";

@Component({
  selector: "ngx-editar",
  templateUrl: "./editar.component.html",
  styleUrls: ["./editar.component.scss"],
})
export class EditarComponent implements OnInit, OnDestroy {
  fecha = new Date().toISOString().slice(0, 10);
  cargoForm: FormGroup;
  id: number;
  areas: any;
  subscripciones: Array<Subscription> = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cargoService: CargoService,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
    private auth: authService,
    private areaService: AreaService
  ) {}

  ngOnInit(): void {
    this.llenadoCombo();
    this.id = this.route.snapshot.params["id"];
    this.cargarForm(this.auth.getUserStorage());
  }
  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe());
  }
  private llenadoCombo(): void {
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
            "Mientras se listaban las áreas" + error.error[0],

            0,
            this.toastrService
          );
        }
      )
    );
  }
  cargarForm(usuario) {
    this.subscripciones.push(
      this.cargoService.buscar(this.id).subscribe(
        (res) => {
          this.cargoForm = this.fb.group({
            desCargo: [
              res.desCargo,
              Validators.compose([
                Validators.required,
                Validators.maxLength(100),
                Util.esVacio,
              ]),
            ],
            areaId: [
              this.areas.find((a) => a.idArea == res.areaId.idArea),
              Validators.required,
            ],
            anulacion: [res.anulacion, Validators.required],
            motivoAnulacion: [res.motivoAnulacion],

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
      this.cargoService
        .editar(this.id, Util.limpiarForm(this.cargoForm.value))
        .subscribe(
          (resp) => {
            this.router.navigate(["../../ListarCargo"], {
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
