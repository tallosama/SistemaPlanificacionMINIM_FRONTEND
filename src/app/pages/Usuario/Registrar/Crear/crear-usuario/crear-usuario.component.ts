import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject, Subscription } from 'rxjs';
import { AreaService } from '../../../../Catalogos/Area/area.service';
import { PersonaService } from '../../../../Catalogos/Persona/persona.service';

@Component({
  selector: 'ngx-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.scss']
})

export class CrearUsuarioComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  subscripciones: Array<Subscription> = [];
  data: any;
  //autocompletado
  keyword = "desArea";
  //areas$: Observable<any>;
  areas: any = [];
  personaSeleccionada = null;
  usuarioForm: FormGroup;
  fecha = new Date().toISOString().slice(0, 10);
  usuario = 1;

  constructor(private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    public fb: FormBuilder,
    private personaService: PersonaService,
    private areaService: AreaService) { }


  reconstruir(area: any): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();

      this.subscripciones.push(this.personaService.listarPorArea(area.idArea).subscribe((resp: any) => {
        this.data = resp;
        this.dtTrigger.next();
      }, error => {
        console.error(error);
        this.showToast('danger', 'Error ' + error.status, 'Mientras se listaban los registros' + error.message, 0);

      }));


    });
  }

  construir(area: any): void {
    this.subscripciones.push(this.personaService.listarPorArea(area.idArea).subscribe((resp: any) => {
      this.data = resp;
      this.dtTrigger.next();
    }, error => {
      console.error(error);
      this.showToast('danger', 'Error ' + error.status, 'Mientras se listaban los registros' + error.message, 0);

    }));
  }

  autoCompletadoArea(): void {
    // this.subscripciones.push(this.areaService.listar().subscribe(resp => this.areas.push(resp)));
    this.subscripciones.push(this.areaService.listar().subscribe(resp => {
      this.areas = resp

      ///MEJORAR ESTOOOOOOOO!!!!!!!!!!!!!!!!!!
      this.construir(resp[0]);
    },
      error => {
        console.error(error);
        this.showToast('danger', 'Error ' + error.status, 'Mientras se listaban categorías ' + error.message, 0);
      }
    ));

  }
  asignarPersona(persona): void {
    this.personaSeleccionada = persona;
  }

  ngOnInit(): void {
    this.autoCompletadoArea();

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      destroy: true,

      language: {
        url: '//cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json'
      },

    };


    this.usuarioForm = this.fb.group(
      {
        Correo: ['', Validators.compose([Validators.required, Validators.maxLength(32)])],
        Clave: ['', Validators.compose([Validators.required, Validators.maxLength(128)])],
        Estado: ['', Validators.required],
        Rol: ['',  Validators.required],
        PersonaId: [ this.personaSeleccionada.idPersona, Validators.required],
        usuarioCreacion: [this.usuario, Validators.required],
        fechaCreacion: [this.fecha, Validators.required],
        usuarioModificacion: [this.usuario, Validators.required],
        fechaModificacion: [this.fecha, Validators.required],
      }
    );



  }
  ngOnDestroy(): void {
    this.subscripciones.forEach(subs => subs.unsubscribe());
    this.dtTrigger.unsubscribe();
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
