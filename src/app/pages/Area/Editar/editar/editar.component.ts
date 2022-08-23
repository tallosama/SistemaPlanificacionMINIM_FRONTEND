import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NbGlobalPhysicalPosition,
  NbToastrService,
  NbToastrConfig,
} from '@nebular/theme';
import { ApiServe } from '../../../../ApiServe';
import { AreaService } from '../../area.service';

@Component({
  selector: 'ngx-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarComponent implements OnInit {
  fecha = new Date().toISOString().slice(0, 10);
  usuario = 1;
  areaForm: UntypedFormGroup;
  id: number;

  //inicializadores del mensaje toast
  config: NbToastrConfig;
  constructor(public fb: UntypedFormBuilder, private router: Router, public areaServices: AreaService, private route: ActivatedRoute, private toastrService: NbToastrService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.areaServices.buscar(this.id).subscribe(res => {
      this.areaForm = this.fb.group(
        {
          desArea: [res.desArea, Validators.compose([Validators.required, Validators.maxLength(512)])],
          usuarioModificacion: [this.usuario, Validators.required],
          fechaModificacion: [this.fecha, Validators.required],

        }
      );
    });


  }
  api:ApiServe;
  public editar(): void {
    this.areaServices.editar(this.id, this.areaForm.value).subscribe(resp => { },
      error => { console.error(error) }
    )
    this.router.navigate(['/', 'ListarAreas']);
    this.showToast();
  }
  //construccion del mensaje
  private showToast() {
    const config = {
      status: 'success',
      destroyByClick: true,
      duration: 4000,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: false,
    };
    const titleContent = 'Acción realizada';

    this.toastrService.show(
      `Se ha editado el registro`,
      `${titleContent}`,
      config);
  }
}
