import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoriaService } from '../../categoria.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbGlobalPhysicalPosition, NbToastrService, NbToastrConfig, } from '@nebular/theme';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarComponent implements OnInit, OnDestroy {

  fecha = new Date().toISOString().slice(0, 10);
  usuario = 1;
  editarCategoriaForm: FormGroup;
  id: number;
  //inicializadores del mensaje toast
  config: NbToastrConfig;
  subscripciones: Array<Subscription> = [];
  constructor(public fb: FormBuilder,
    private router: Router,
    public categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private toastrService: NbToastrService) { }


  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.subscripciones.push(this.categoriaService.buscar(this.id).subscribe(res => {
      this.editarCategoriaForm = this.fb.group(
        {
          descripCategoria: [res.descripCategoria, Validators.compose([Validators.required, Validators.maxLength(100)])],
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
    this.subscripciones.push(this.categoriaService.editar(this.id, this.editarCategoriaForm.value).subscribe(resp => {

      this.router.navigate(['../../ListarCategoria'], { relativeTo: this.route });
      this.showToast('success', 'Acción realizada', 'Se ha editado el registro', 4000);
    },
      error => {
        console.error(error);
        this.showToast('danger', 'Error ' + error.status, 'Verifique que no exista un registro con el mismo nombre ' + error.message, 0);
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
