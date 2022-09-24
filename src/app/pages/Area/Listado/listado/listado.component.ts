import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { Value } from 'sass';
import { DialogNamePromptComponent } from '../../../modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component';
import { AreaService } from '../../area.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ApiServe } from '../../../../ApiServe';

@Component({
  selector: 'ngx-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss']
})

export class ListadoComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  subscripciones: Array<Subscription> = [];
  constructor(private areaService: AreaService, private router: Router, private dialogService: NbDialogService, private toastrService: NbToastrService) {
  } 
  //para datatables
  data: any;
  construir(): void {
    //carga de datos
    this.listar();
    this.subscripciones.push(this.areaService.refresh.subscribe(() => {
      this.listar();
    }));
  }
  listar(): void {
    this.subscripciones.push(this.areaService.listar().subscribe((resp: any) => { this.data = resp }));
  }
  ngOnInit(): void {
    this.construir();

    //datatables
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      destroy: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json'
      }
    };
  }

  ngOnDestroy(): void {
    this.subscripciones.forEach(o => o.unsubscribe());
  }
  eliminar(id): void {

    this.subscripciones.push(this.areaService.eliminar(id).subscribe(res => {
      if (res) {
        this.toast('success', 'Acción realizada', 'Se ha eliminado el registro');
      } else {
        this.toast('warning', 'Atención', 'No se ha encontrado el registro');
      }
    }));
  }
  public toast(estado: string, titulo: string, cuerpo: string) {
    const config = {
      status: estado,
      destroyByClick: true,
      duration: 4000,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: false,
    };

    this.toastrService.show(
      cuerpo,
      `${titulo}`,
      config);
  }
  confirmacion(id): void {
    this.subscripciones.push(this.dialogService.open(DialogNamePromptComponent).onClose.subscribe(res => {
      if (res) {
        this.eliminar(id);
      }
    }));
  }
  //construccion del mensaje

}
