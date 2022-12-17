import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NbToastrService } from "@nebular/theme";
import { Subscription } from "rxjs";
import { authService } from "../../../../../auth/auth.service";
import { Util } from "../../../../Globales/Util";
import { SectorService } from "../../sector.service";

@Component({
  selector: "ngx-editar",
  templateUrl: "./editar.component.html",
  styleUrls: ["./editar.component.scss"],
})
export class EditarComponent implements OnInit, OnDestroy {
  fecha = new Date().toISOString().slice(0, 10);
  sectorForm: FormGroup;
  id: number;
  subscripciones: Array<Subscription> = [];
  constructor(
    public fb: FormBuilder,
    private router: Router,
    private sectorService: SectorService,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
    private auth: authService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params["id"];
    this.cargarForm(this.auth.getUserStorage());
  }
  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe());
  }
  private cargarForm(usuario) {
    this.subscripciones.push(
      this.sectorService.buscar(this.id).subscribe(
        (res) => {
          this.sectorForm = this.fb.group({
            desSector: [
              res.desSector,
              Validators.compose([
                Validators.required,
                Validators.maxLength(512),
                Util.esVacio,
              ]),
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
      this.sectorService
        .editar(this.id, Util.limpiarForm(this.sectorForm.value))
        .subscribe(
          (resp) => {
            this.router.navigate(["../../ListarSector"], {
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
