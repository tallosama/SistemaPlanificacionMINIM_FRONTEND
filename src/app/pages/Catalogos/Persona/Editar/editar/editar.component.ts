import { Component, OnDestroy, OnInit } from '@angular/core'
import { PersonaService } from '../../persona.service'
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbGlobalPhysicalPosition, NbToastrService, NbToastrConfig, } from '@nebular/theme';
import { AreaService } from '../../../Area/area.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarComponent implements OnInit, OnDestroy {

  fecha = new Date().toISOString().slice(0, 10);
  usuario = 1;
  editarPersonaForm: FormGroup;
  id: number;
  //inicializadores del mensaje toast
  config: NbToastrConfig;
  estado = [
    { esActivo: true, Estado: "Activo" },
    { esActivo: false, Estado: "Inactivo" }
  ]
  areas: any;
  subscripciones: Array<Subscription> = [];
  constructor(public fb: FormBuilder,
    private router: Router,
    public personaService: PersonaService,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
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

    this.id = this.route.snapshot.params['id'];
    this.subscripciones.push(this.personaService.buscar(this.id).subscribe(res => {

      this.editarPersonaForm = this.fb.group(
        {
          cedula: [res.cedula, Validators.compose([Validators.required, Validators.minLength(16), Validators.maxLength(50)])],
          pNombre: [res.pNombre, Validators.compose([Validators.required, Validators.maxLength(32)])],
          sNombre: [res.sNombre,  Validators.maxLength(32)],
          pApellido: [res.pApellido, Validators.compose([Validators.required, Validators.maxLength(32)])],
          sApellido: [res.sApellido, Validators.maxLength(32)],
          tipo: [res.tipo, Validators.compose([Validators.required, Validators.maxLength(32)])],
          estado: [res.estado, Validators.required],
          usuarioModificacion: [this.usuario, Validators.required],
          fechaModificacion: [this.fecha, Validators.required],
        }
      );
    },
      error => {
        console.error(error);
        this.showToast('danger', 'Error ' + error.status, 'Mientras se buscaba un registro ' + error.message, 0);
      }
    ));

  }
  ngOnDestroy(): void {
    this.subscripciones.forEach(s => s.unsubscribe());
  }

  public editar(): void {
    this.subscripciones.push(this.personaService.editar(this.id, this.editarPersonaForm.value).subscribe(resp => {

      this.router.navigate(['../../ListarPersona'], { relativeTo: this.route });
      this.showToast('success', 'Acción realizada', 'Se ha editado el registro', 4000);
    },
      error => {
        console.error(error);
        this.showToast('danger', 'Error ' + error.status, 'Verifique que no exista un registro con la misma identificación ' + error.message, 0);
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
