import { Component, OnDestroy, OnInit } from "@angular/core";
import { PersonaService } from "../../persona.service";
import { ActivatedRoute, Router } from "@angular/router";
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
import { AreaService } from "../../../Area/area.service";
import { Subscription } from "rxjs";
import { authService } from "../../../../../auth/auth.service";
import { Control } from "../../../../Globales/Control";

@Component({
  selector: "ngx-editar",
  templateUrl: "./editar.component.html",
  styleUrls: ["./editar.component.scss"],
})
export class EditarComponent implements OnInit, OnDestroy {
  fecha = new Date().toISOString().slice(0, 10);
  personaForm: FormGroup;
  id: number;
  //inicializadores del mensaje toast
  config: NbToastrConfig;
  estado = [
    { esActivo: true, Estado: "Activo" },
    { esActivo: false, Estado: "Inactivo" },
  ];
  areas: any;
  subscripciones: Array<Subscription> = [];
  constructor(
    public fb: FormBuilder,
    private router: Router,
    public personaService: PersonaService,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
    public areaService: AreaService,
    public auth: authService
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
            "Mientras se listaban las áreas" +
              Control.evaluarErrorDependiente(error.error),

            0
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
                this.noWhitespaceValidator,
              ]),
            ],
            pNombre: [
              res.pNombre,
              Validators.compose([
                Validators.required,
                Validators.maxLength(32),
                this.noWhitespaceValidator,
              ]),
            ],
            sNombre: [res.sNombre, Validators.maxLength(32)],
            pApellido: [
              res.pApellido,
              Validators.compose([
                Validators.required,
                Validators.maxLength(32),
                this.noWhitespaceValidator,
              ]),
            ],
            sApellido: [res.sApellido, Validators.maxLength(32)],
            tipo: [
              res.tipo,
              Validators.compose([
                Validators.required,
                Validators.maxLength(32),
                this.noWhitespaceValidator,
              ]),
            ],
            poseeUsuario: [res.poseeUsuario, Validators.required],
            estado: [res.estado, Validators.required],
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
            "Mientras se buscaba un registro" +
              Control.evaluarErrorDependiente(error.error),

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
      this.personaService.editar(this.id, this.personaForm.value).subscribe(
        (resp) => {
          this.router.navigate(["../../ListarPersona"], {
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
            "Mientras se editaba un registro" +
              Control.evaluarErrorRepetido(error.error),

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
