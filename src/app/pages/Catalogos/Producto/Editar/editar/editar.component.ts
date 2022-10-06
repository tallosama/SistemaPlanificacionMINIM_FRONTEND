import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbGlobalPhysicalPosition, NbToastrService, NbToastrConfig, } from '@nebular/theme';
import { ProductoService } from '../../producto.service';
import { CategoriaService } from '../../../Categoria/categoria.service';
import { MedidaService } from '../../../UnidadMedida/medida.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'ngx-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarComponent implements OnInit, OnDestroy {

  fecha = new Date().toISOString().slice(0, 10);
  usuario = 1;
  editarProductoForm: FormGroup;
  id: number;
  //inicializadores del mensaje toast
  config: NbToastrConfig;
  tipoMaterial = [
    { tipoM: "Bien de uso" },
    { tipoM: "Consumible" }
  ];
  categoria: any;
  unidadMedida: any;
  subscripciones: Array<Subscription> = [];
  constructor(public fb: FormBuilder,
    private router: Router,
    public productoService: ProductoService,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
    public categoriaService: CategoriaService,
    public unidadMedidaService: MedidaService,) {}


  private llenadoCombobox(): void {
    this.subscripciones.push(this.categoriaService.listar().subscribe(resp => {
      this.categoria = resp;
    },
      error => {
        console.error(error);
        this.showToast('danger', 'Error ' + error.status, 'Mientras se listaban categorías ' + error.message, 0);
      }
    ));

    this.subscripciones.push(this.unidadMedidaService.listar().subscribe(resp => {
      this.unidadMedida = resp;
    },
      error => {
        console.error(error);
        this.showToast('danger', 'Error ' + error.status, 'Mientras se listaban unidades de medida ' + error.message, 0);
      }
    )
    );
  }

  ngOnInit(): void {
    this.llenadoCombobox();

    this.id = this.route.snapshot.params['id'];
    this.subscripciones.push(this.productoService.buscar(this.id).subscribe(res => {
      
      this.editarProductoForm = this.fb.group(
        {
          descripcion: [res.descripcion, Validators.compose([Validators.required, Validators.maxLength(128)])],
          cantMinima: [res.cantMinima, Validators.required],
          cantStock: [res.cantStock, Validators.required],
          tipoMaterial: [res.tipoMaterial, Validators.compose([Validators.required, Validators.maxLength(50)])],
          unidadMedidaId:[ '', Validators.required],
          categoriaId: ['', Validators.required],
          usuarioModificacion: [this.usuario, Validators.required],
          fechaModificacion: [this.fecha, Validators.required]
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
    this.subscripciones.push(this.productoService.editar(this.id, this.editarProductoForm.value).subscribe(resp => {

      this.router.navigate(['../../ListarProducto'], { relativeTo: this.route });
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
