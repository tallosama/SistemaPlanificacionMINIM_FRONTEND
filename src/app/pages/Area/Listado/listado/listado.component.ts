import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { Value } from 'sass';
import { DialogNamePromptComponent } from '../../../modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component';
import { AreaService } from '../../area.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables'; 

@Component({
  selector: 'ngx-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss']
})

export class ListadoComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  //dtElement: DataTableDirective;
  //dtInstance: DataTables.Api;

  constructor(private areaService: AreaService, private router: Router, private dialogService: NbDialogService, private toastrService: NbToastrService) { }
  data: any;

  //para datatables
 
  construir(): void {
    //carga de datos
    this.areaService.listar().subscribe((resp: any) => {
      this.data = resp;
     
      this.dtTrigger.next();
    },
      error => { console.error(error) }
    );

  }
  
  rerender(): void {  
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
      }
   
  ngOnInit(): void {
    //datatables
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      destroy: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json'
      }
    };
    this.construir();

  }

  eliminar(id):void {

    this.areaService.eliminar(id).subscribe(res => {
      if (res) {
        this.showToast('success', 'Acción realizada', 'Se ha eliminado el registro');
      } else {
        this.showToast('warning', 'Atención', 'No se ha encontrado el registro');
      }
    });
   this.rerender();
  }

  confirmacion(id): void {
    this.dialogService.open(DialogNamePromptComponent).onClose.subscribe(res => {
      if (res) {
        this.eliminar(id);
      }
    });


  }


  ngOnDestroy(): void {
    $.fn['dataTable'].ext.search.pop();
  }
   
  //construccion del mensaje
  private showToast(estado: string, titulo: string, cuerpo: string) {
    const config = {
      status: estado,
      destroyByClick: true,
      duration: 4000,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: false,
    };
    const titleContent = titulo;

    this.toastrService.show(
      cuerpo,
      `${titleContent}`,
      config);
  }

}
