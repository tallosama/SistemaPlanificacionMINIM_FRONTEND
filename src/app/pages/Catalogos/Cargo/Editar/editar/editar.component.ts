import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NbGlobalPhysicalPosition, NbToastrService } from "@nebular/theme";
import { Subscription } from "rxjs";
import { authService } from "../../../../../auth/auth.service";
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
          this.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban las áreas" + error.error[0],

            0
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
                this.noWhitespaceValidator,
              ]),
            ],
            areaId: [
              this.areas.find((a) => a.idArea == res.areaId.idArea),
              Validators.required,
            ],
            usuarioModificacion: [usuario.uid, Validators.required],
            fechaModificacion: [this.fecha, Validators.required],
          });
        },
        (error) => {
          console.error(error);
          this.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se buscaba un registro" + error.error[0],
            0
          );
        }
      )
    );
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  public editar(): void {
    this.subscripciones.push(
      this.cargoService.editar(this.id, this.cargoForm.value).subscribe(
        (resp) => {
          this.router.navigate(["../../ListarCargo"], {
            relativeTo: this.route,
          });
          this.showToast(
            "success",
            "Acción realizada",
            "Se ha editado el registro",
            4000
          );
        },
        (error) => {
          console.error(error);
          this.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se editaba un registro" + error.error[0],
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
