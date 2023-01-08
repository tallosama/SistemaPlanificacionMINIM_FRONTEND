import { Component, OnInit, Input } from "@angular/core";
import { ViewCell } from "ng2-smart-table";
@Component({
  selector: 'ngx-render-descripcion-requerimiento',
  template: "{{desRequerimiento}}",
  styleUrls: ['./render-descripcion-requerimiento.component.scss']
})
export class RenderDescripcionRequerimientoComponent implements ViewCell, OnInit {
  constructor() { }

  renderValue: string;
  @Input() value: string | number;
  @Input() rowData: any;
  desRequerimiento: string;
  ngOnInit() {
    this.desRequerimiento =
      this.rowData.requerimientoId.desRequerimiento;
  }
}
