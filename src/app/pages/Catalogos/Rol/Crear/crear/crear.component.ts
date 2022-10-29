import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import {
  NbGlobalPhysicalPosition,
  NbToastrService,
  NbToastrConfig,
} from "@nebular/theme";
import { RolService } from "../../rol.service";
import { Subscription } from "rxjs";
import { authService } from "../../../../../auth/auth.service";

@Component({
  selector: "ngx-crear",
  templateUrl: "./crear.component.html",
  styleUrls: ["./crear.component.scss"],
})
export class CrearComponent implements OnInit, OnDestroy {
  fecha = new Date().toISOString().slice(0, 10);
  rolForm: FormGroup;
  //inicializadores del mensaje toast
  config: NbToastrConfig;
  subscripcion: Array<Subscription> = [];

  constructor(
    public fb: UntypedFormBuilder,
    public rolService: RolService,
    private toastrService: NbToastrService,
    private auth: authService
  ) {}

  ngOnInit(): void {
    this.cargarForm(this.auth.getUserStorage());
  }

  ngOnDestroy(): void {
    this.subscripcion.forEach((s) => s.unsubscribe());
  }

  private cargarForm(usuario) {
    this.rolForm = this.fb.group({
      desRol: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(512),
          this.noWhitespaceValidator,
        ]),
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
    this.rolForm.get("desRol").reset();
  }

  guardar(): void {
    this.subscripcion.push(
      this.rolService.guardar(this.rolForm.value).subscribe(
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
