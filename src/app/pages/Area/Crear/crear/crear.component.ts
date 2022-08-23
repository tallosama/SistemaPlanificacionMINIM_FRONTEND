import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { 
  NbGlobalPhysicalPosition, 
  NbToastrService,
  NbToastrConfig,
} from '@nebular/theme';
import { AreaService } from '../../area.service';

@Component({
  selector: 'ngx-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss']
})

export class CrearComponent implements OnInit {
  fecha = new Date().toISOString().slice(0, 10);
  usuario = 1;
  areaForm: UntypedFormGroup;

  //inicializadores del mensaje toast
  config: NbToastrConfig;
  constructor(public fb: UntypedFormBuilder, public areaServices: AreaService, private toastrService: NbToastrService) { }

  ngOnInit(): void {
    this.areaForm = this.fb.group(
      {
        desArea: ['', Validators.compose([Validators.required,  Validators.maxLength(512)])],
        usuarioCreacion: [this.usuario, Validators.required],
        fechaCreacion: [this.fecha, Validators.required],
        usuarioModificacion: [this.usuario, Validators.required],
        fechaModificacion: [this.fecha, Validators.required],

      }
    );
  }


  guardar(): void {
    this.areaServices.guardar(this.areaForm.value).subscribe(resp => { },
      error => { console.error(error) }
    )
    this.areaForm.get('desArea').reset();
    this.showToast();
  }
//construccion del mensaje
  private showToast() {
    const config = {
      status: 'success',
      destroyByClick: true,
      duration: 4000,
      hasIcon: true,
      position:  NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: false,
    };
    const titleContent = 'Acción realizada';

    this.toastrService.show(
      `Se ha ingresado el registro`,
      `${titleContent}`,
      config);
  }

}
