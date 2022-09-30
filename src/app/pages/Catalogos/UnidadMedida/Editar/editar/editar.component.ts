import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {NbGlobalPhysicalPosition,NbToastrService,NbToastrConfig,} from '@nebular/theme'; 
import { MedidaService } from '../../medida.service';

@Component({
  selector: 'ngx-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarComponent implements OnInit {

  fecha = new Date().toISOString().slice(0, 10);
  usuario = 1;
  editarMedidaForm: FormGroup;
  id: number;
  //inicializadores del mensaje toast
  config: NbToastrConfig;

  constructor(public fb: FormBuilder,
    private router: Router,
    public medidaService: MedidaService,
    private route: ActivatedRoute,
    private toastrService: NbToastrService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.medidaService.buscar(this.id).subscribe(res => {
      this.editarMedidaForm = this.fb.group(
        {
          descripUnidadMedida: [res.descripUnidadMedida, Validators.compose([Validators.required, Validators.maxLength(512)])],
          usuarioModificacion: [this.usuario, Validators.required],
          fechaModificacion: [this.fecha, Validators.required],
        }
      );
    },
      error => { console.error(error) }
    );
  }
 
  public editar(): void {
    this.medidaService.editar(this.id, this.editarMedidaForm.value).subscribe(resp => { },
      error => { console.error(error) }
    )
    this.router.navigate(['../../ListarUnidadMedida'], { relativeTo: this.route });
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
