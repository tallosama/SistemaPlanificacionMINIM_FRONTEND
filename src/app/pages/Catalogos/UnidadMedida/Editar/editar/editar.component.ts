import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NbGlobalPhysicalPosition,
  NbToastrService,
  NbToastrConfig,
} from "@nebular/theme";
import { Subscription } from "rxjs";
import { authService } from "../../../../../auth/auth.service";
import { MedidaService } from "../../medida.service";

@Component({
  selector: "ngx-editar",
  templateUrl: "./editar.component.html",
  styleUrls: ["./editar.component.scss"],
})
export class EditarComponent implements OnInit, OnDestroy {
  fecha = new Date().toISOString().slice(0, 10);
  unidadMedidaForm: FormGroup;
  id: number;
  //inicializadores del mensaje toast
  config: NbToastrConfig;
  subscripciones: Array<Subscription> = [];

  constructor(
    public fb: FormBuilder,
    private router: Router,
    public medidaService: MedidaService,
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
    this.medidaService.buscar(this.id).subscribe(
      (res) => {
        this.unidadMedidaForm = this.fb.group({
          descripUnidadMedida: [
            res.descripUnidadMedida,
            Validators.compose([
              Validators.required,
              Validators.maxLength(512),
              this.noWhitespaceValidator,
            ]),
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
          "Mientras se buscaba un registro " + error.message,
          0
        );
      }
    );
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  public editar(): void {
    this.subscripciones.push(
      this.medidaService.editar(this.id, this.unidadMedidaForm.value).subscribe(
        (resp) => {
          this.router.navigate(["../../ListarUnidadMedida"], {
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
            "Verifique que no exista un registro con el mismo nombre " +
              error.message,
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
