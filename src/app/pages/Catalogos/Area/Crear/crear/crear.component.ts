import { Component, OnDestroy, OnInit } from "@angular/core";
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
import { Subscription } from "rxjs";
import { AreaService } from "../../area.service";
import { authService } from "../../../../../auth/auth.service";
import { Control } from "../../../../Globales/Control";
@Component({
  selector: "ngx-crear",
  templateUrl: "./crear.component.html",
  styleUrls: ["./crear.component.scss"],
})
export class CrearComponent implements OnInit, OnDestroy {
  fecha = new Date().toISOString().slice(0, 10);
  areaForm: FormGroup;
  //inicializadores del mensaje toast
  config: NbToastrConfig;
  subscripcion: Array<Subscription> = [];

  constructor(
    public fb: FormBuilder,
    public areaServices: AreaService,
    private toastrService: NbToastrService,

    private auth: authService
  ) {}

  ngOnInit() {
    // await this.auth.getUser().then((r) => (this.usuario = r)); //Si queremos trabajar con datos de promesas, usar un awair para almacenar lo que retorna

    this.cargarForm(this.auth.getUserStorage());
  }
  ngOnDestroy(): void {
    this.subscripcion.forEach((s) => s.unsubscribe());
  }
  limpiar(): void {
    this.areaForm.get("desArea").reset();
  }
  cargarForm(user): void {
    this.areaForm = this.fb.group({
      desArea: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(512),
          this.noWhitespaceValidator,
        ]),
      ],
      usuarioCreacion: [user.uid, Validators.required],
      fechaCreacion: [this.fecha, Validators.required],
      usuarioModificacion: [user.uid, Validators.required],
      fechaModificacion: [this.fecha, Validators.required],
    });
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  guardar(): void {
    this.subscripcion.push(
      this.areaServices.guardar(this.areaForm.value).subscribe(
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
            "Mientras se realizaba un registro" +
              Control.evaluarErrorRepetido(error.error),
            0
          );
        }
      )
    );
  }

  // construccion del mensaje
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
