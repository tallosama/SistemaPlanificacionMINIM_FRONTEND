import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbGlobalPhysicalPosition, NbToastrService, NbToastrConfig, } from '@nebular/theme';
import { ProductoService } from '../../producto.service';
import { CategoriaService } from '../../../Categoria/categoria.service';
import { MedidaService } from '../../../UnidadMedida/medida.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss']
})
export class CrearComponent implements OnInit, OnDestroy {

  fecha = new Date().toISOString().slice(0, 10);
  usuario = 1;
  registrarProductoForm: FormGroup;
  //inicializadores del mensaje toast
  config: NbToastrConfig;
  tipoMaterial = [
    { tipoM: "Bien de uso" },
    { tipoM: "Consumible" }
  ];
  categoria: any;
  unidadMedida: any;
  subscripciones: Array<Subscription> = [];

  constructor(private toastrService: NbToastrService,
    public fb: FormBuilder,
    public productoService: ProductoService,
    public categoriaService: CategoriaService,
    public unidadMedidaService: MedidaService) { }


  ngOnInit(): void {
    this.registrarProductoForm = this.fb.group(
      {
        descripcion: ['', Validators.compose([Validators.required, Validators.maxLength(128)])],
        cantMinima: ['', Validators.required],
        cantStock: ['', Validators.required],
        tipoMaterial: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
        unidadMedidaId: ['', Validators.required],
        categoriaId: ['', Validators.required],
        usuarioCreacion: [this.usuario, Validators.required],
        fechaCreacion: [this.fecha, Validators.required],
        usuarioModificacion: [this.usuario, Validators.required],
        fechaModificacion: [this.fecha, Validators.required],
      }
    );

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
  ngOnDestroy(): void {
    this.subscripciones.forEach(s => s.unsubscribe);
  }
  limpiar(): void {
    this.registrarProductoForm.get('descripcion').reset();
    this.registrarProductoForm.get('cantMinima').reset();
    this.registrarProductoForm.get('cantStock').reset();

    // this.registrarProductoForm.get('tipoMaterial').reset();
    // this.registrarProductoForm.get('unidadMedidaId').reset();
    // this.registrarProductoForm.get('categoriaId').reset();
  }


  guardar(): void {
    this.subscripciones.push(this.productoService.guardar(this.registrarProductoForm.value).subscribe(resp => {

      this.showToast('success', 'Acción realizada', 'Se ha ingresado el registro', 4000);

      this.limpiar();
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
