import { Component, OnInit } from "@angular/core";
import { ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NbGlobalPhysicalPosition, NbToastrService } from "@nebular/theme";
import { authService } from "../auth.service";

@Component({
  selector: "ngx-request",
  templateUrl: "./request-password.component.html",
})
export class NgxRequestPasswordComponent implements OnInit {
  requestForm: FormGroup;
  user: any;
  constructor(
    public fb: FormBuilder,
    private auth: authService,
    private router: Router,
    private toastrService: NbToastrService
  ) {}
  ngOnInit(): void {
    this.requestForm = this.fb.group({
      correo: ["", Validators.compose([Validators.required, Validators.email])],
    });
  }
  async solicitarClave() {
    await this.auth
      .request(this.requestForm.controls.correo.value)
      .then(() => {
        this.showToast(
          "primary",
          "Solicitud enviada",
          "Si no encuetra el correo, asegurese de revisar en el spam",
          10000
        );
        this.router.navigate(["../login"]);
      })
      .catch((e) =>
        this.showToast(
          "danger",
          "Error " + e.status,
          "Mientras se solicitaba el reestablecimiento de clave " + e.message,
          0
        )
      );
  }
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
