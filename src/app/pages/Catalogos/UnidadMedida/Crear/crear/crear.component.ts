import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbGlobalPhysicalPosition, NbToastrService, NbToastrConfig, } from '@nebular/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { MedidaService } from '../../medida.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss']
})
export class CrearComponent implements OnInit, OnDestroy {

  fecha = new Date().toISOString().slice(0, 10);
  usuario = 1;
  registrarMedidaForm: FormGroup;
  //inicializadores del mensaje toast
  config: NbToastrConfig;
  subscripcion: Array<Subscription> = [];
  constructor(public fb: FormBuilder,
    public medidaService: MedidaService,
    private toastrService: NbToastrService) { }

  ngOnInit(): void {
    this.registrarMedidaForm = this.fb.group(
      {
        descripUnidadMedida: ['', Validators.compose([Validators.required, Validators.maxLength(60)])],
        usuarioCreacion: [this.usuario, Validators.required],
        fechaCreacion: [this.fecha, Validators.required],
        usuarioModificacion: [this.usuario, Validators.required],
        fechaModificacion: [this.fecha, Validators.required],
      }
    );
  }
  ngOnDestroy(): void {
    this.subscripcion.forEach(s => s.unsubscribe());
  }
  limpiar(): void {
    this.registrarMedidaForm.get('descripUnidadMedida').reset();
  }

  guardar(): void {
    this.subscripcion.push(this.medidaService.guardar(this.registrarMedidaForm.value).subscribe(resp => {

      this.showToast('success', 'Acción realizada', 'Se ha ingresado el registro', 4000);

      this.limpiar();
    },
      error => {
        console.error(error);
        this.showToast('danger', 'Error ' + error.status, 'Verifique que no exista un registro con el mismo nombre ' + error.message, 0);
      }
    ));
  }
  //construccion del mensaje
  public showToast(estado: string, titulo: string, cuerpo: string, duracion: number) {
    const config = {
      status: estado,
      destroyByClick: true,
      duration: duracion,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: false,
    };

    this.toastrService.show(
      cuerpo,
      `${titulo}`,
      config);
  }
}
