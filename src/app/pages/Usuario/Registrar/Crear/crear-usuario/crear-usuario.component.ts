import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NbDialogService, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';
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
  areaId: number;
  constructor(private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private personaService: PersonaService) { }

  construir(): void {
    this.subscripciones.push(this.personaService.listarPorArea(this.areaId).subscribe((resp: any) => {
      this.data = resp;
      this.dtTrigger.next();
    }, error => {
      console.error(error);
      this.showToast('danger', 'Error ' + error.status, 'Mientras se listaban los registros' + error.message, 0);

    }));
  }
  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      destroy: true,

      language: {
        url: '//cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json'
      },

    };

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
