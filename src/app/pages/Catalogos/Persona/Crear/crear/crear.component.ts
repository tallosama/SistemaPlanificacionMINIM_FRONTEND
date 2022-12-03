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
import { PersonaService } from "../../persona.service";
import { AreaService } from "../../../Area/area.service";
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
  personaForm: FormGroup;
  //inicializadores del mensaje toast
  config: NbToastrConfig;
  estado = [
    { esActivo: true, Estado: "Activo" },
    { esActivo: false, Estado: "Inactivo" },
  ];
  areas: any;
  subscripciones: Array<Subscription> = [];
  constructor(
    private toastrService: NbToastrService,
    public fb: FormBuilder,
    public personaService: PersonaService,
    public areaService: AreaService,
    private auth: authService
  ) {}

  private llenadoCombobox(): void {
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
          Validators.minLength(16),
          Validators.maxLength(50),
          this.noWhitespaceValidator,
        ]),
      ],
      pNombre: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(32),
          this.noWhitespaceValidator,
        ]),
      ],
      sNombre: ["", Validators.maxLength(32)],
      pApellido: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(32),
          this.noWhitespaceValidator,
        ]),
      ],
      sApellido: ["", Validators.maxLength(32)],
      tipo: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(32)]),
      ],
      poseeUsuario: [false, Validators.required],
      areaId: ["", Validators.required],
      estado: [this.estado[0].esActivo, Validators.required],
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
    this.personaForm.get("cedula").reset();
    this.personaForm.get("pNombre").reset();
    this.personaForm.get("sNombre").reset();
    this.personaForm.get("pApellido").reset();
    this.personaForm.get("sApellido").reset();
  }

  guardar(): void {
    this.subscripciones.push(
      this.personaService.guardar(this.personaForm.value).subscribe(
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
            "Mientras se realizaba un registro" + error.error[0],
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
