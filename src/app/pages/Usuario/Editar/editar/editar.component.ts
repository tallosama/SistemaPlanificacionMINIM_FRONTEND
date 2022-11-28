import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NbDialogService,
  NbGlobalPhysicalPosition,
  NbToastrService,
} from "@nebular/theme";
import { Subscription } from "rxjs";
import { authService } from "../../../../auth/auth.service";
import { RolService } from "../../../Catalogos/Rol/rol.service";

@Component({
  selector: "ngx-editar",
  templateUrl: "./editar.component.html",
  styleUrls: ["./editar.component.scss"],
})
export class EditarComponent implements OnInit, OnDestroy {
  subscripciones: Array<Subscription> = [];
  roles: any;
  usuarioForm: FormGroup;
  fecha = new Date().toISOString().slice(0, 10);
  estado = [
    { Estado: true, Descripcion: "Activo" },
    { Estado: false, Descripcion: "Inactivo" },
  ];
  id: string;
  constructor(
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private router: Router,
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private auth: authService,
    private rol: RolService
  ) {}
  listarRole(): void {
    this.subscripciones.push(
      this.rol.listar().subscribe((r) => {
        this.roles = r;
      })
    );
  }

  ngOnInit() {
    this.listarRole();
    this.id = this.route.snapshot.params["id"];
    this.cargarForm(this.auth.getUserStorage());
  }
  ngOnDestroy(): void {
    this.subscripciones.forEach((subs) => subs.unsubscribe());
  }
  cargarForm(usuario) {
    this.subscripciones.push(
      this.auth.findUserDB(this.id).subscribe(
        (u) => {
          this.usuarioForm = this.fb.group({
            Correo: [
              u.data()["Correo"],
              Validators.compose([
                Validators.required,
                Validators.maxLength(32),
                Validators.email,
              ]),
            ],
            uId: [u.data()["uId"]],
            Clave: ["", Validators.maxLength(128)],
            Estado: [u.data()["Estado"], Validators.required],
            Rol: [u.data()["Rol"], Validators.required],
            PersonaId: [u.data()["PersonaId"], Validators.required],
            usuarioCreacion: [u.data()["usuarioCreacion"], Validators.required],
            fechaCreacion: [u.data()["fechaCreacion"], Validators.required],
            usuarioModificacion: [usuario.uid, Validators.required],
            fechaModificacion: [this.fecha, Validators.required],
          });
        },
        (error) => {
          console.error(error);
          this.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se buscaba un usuario" + error.error[0],
            0
          );
        }
      )
    );
  }
  public async editar() {
    console.log(this.usuarioForm.value);
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
