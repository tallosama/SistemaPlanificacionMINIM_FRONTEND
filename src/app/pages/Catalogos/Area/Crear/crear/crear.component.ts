import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NbGlobalPhysicalPosition,
  NbToastrService,
  NbToastrConfig,
} from '@nebular/theme';
import { Subscription } from 'rxjs';
import { AreaService } from '../../area.service';

@Component({
  selector: 'ngx-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss']
})

export class CrearComponent implements OnInit, OnDestroy {

  fecha = new Date().toISOString().slice(0, 10);
  usuario = 1;
  areaForm: FormGroup;
  //inicializadores del mensaje toast
  config: NbToastrConfig;
  subscripcion: Array<Subscription> = [];
  constructor(public fb: FormBuilder, public areaServices: AreaService, private toastrService: NbToastrService) { }

  ngOnInit(): void {
    this.areaForm = this.fb.group(
      {
        desArea: ['', Validators.compose([Validators.required, Validators.maxLength(512)])],
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
    this.areaForm.get('desArea').reset();
  }
  guardar(): void {
    this.subscripcion.push(
      this.areaServices.guardar(this.areaForm.value).subscribe(resp => {
        this.showToast('success', 'Acción realizada', 'Se ha ingresado el registro', 4000);

        this.limpiar();
      },
        error => {
          console.error(error);
          this.showToast('danger', 'Error ' + error.status, 'Mientras se ingresaba un registro ' + error.message, 0);
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
