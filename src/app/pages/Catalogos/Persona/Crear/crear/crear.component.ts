import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbGlobalPhysicalPosition, NbToastrService, NbToastrConfig, } from '@nebular/theme';
import { PersonaService } from '../../persona.service';
import { AreaService } from '../../../Area/area.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss']
})
export class CrearComponent implements OnInit, OnDestroy {

  fecha = new Date().toISOString().slice(0, 10);
  usuario = 1;
  registrarPersonaForm: FormGroup;
  //inicializadores del mensaje toast
  config: NbToastrConfig;
  estado = [
    { esActivo: true, Estado: "activo" },
    { esActivo: false, Estado: "inactivo" }
  ]
  areas: any;
  subscripciones: Array<Subscription> = [];
  constructor(private toastrService: NbToastrService,
    public fb: FormBuilder,
    public personaService: PersonaService,
    public areaService: AreaService) { }

    
  private llenadoCombobox(): void {
    this.subscripciones.push(this.areaService.listar().subscribe(resp => {
      this.areas = resp;
    },
      error => {
        console.error(error);
        this.showToast('danger', 'Error ' + error.status, 'Mientras se listaban áreas ' + error.message, 0);
      }
    ));
  }
  ngOnInit(): void {
    this.llenadoCombobox();
    this.registrarPersonaForm = this.fb.group(
      {
        cedula: ['', Validators.compose([Validators.required, Validators.minLength(16), Validators.maxLength(50)])],
        pNombre: ['', Validators.compose([Validators.required, Validators.maxLength(32)])],
        sNombre: ['', Validators.compose([Validators.required, Validators.maxLength(32)])],
        pApellido: ['', Validators.compose([Validators.required, Validators.maxLength(32)])],
        sApellido: ['', Validators.compose([Validators.required, Validators.maxLength(32)])],
        tipo: ['', Validators.compose([Validators.required, Validators.maxLength(32)])],
        estado: ['', Validators.required],
        usuarioCreacion: [this.usuario, Validators.required],
        fechaCreacion: [this.fecha, Validators.required],
        usuarioModificacion: [this.usuario, Validators.required],
        fechaModificacion: [this.fecha, Validators.required],
      }
    );

  }
  ngOnDestroy(): void {
    this.subscripciones.forEach(s => s.unsubscribe);
  }

  limpiar(): void {
    this.registrarPersonaForm.get('cedula').reset();
    this.registrarPersonaForm.get('pNombre').reset();
    this.registrarPersonaForm.get('sNombre').reset();
    this.registrarPersonaForm.get('pApellido').reset();
    this.registrarPersonaForm.get('sApellido').reset();
    this.registrarPersonaForm.get('tipo').reset();
    this.registrarPersonaForm.get('estado').reset();

  }

  guardar(): void {
    this.subscripciones.push(this.personaService.guardar(this.registrarPersonaForm.value).subscribe(resp => {

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
