import { Component, OnInit, Input } from "@angular/core";
import { ViewCell } from "ng2-smart-table";

@Component({
  selector: "ngx-render-requerimiento-cantidad-aprobada",
  template: "{{cantidad}}",
  styleUrls: ["./render-requerimiento-cantidad-aprobada.component.scss"],
})
export class RenderRequerimientoCantidadAprobadaComponent
  implements ViewCell, OnInit
{
  constructor() {}

  renderValue: string;
  @Input() value: string | number;
  @Input() rowData: any;
  cantidad: string;
  ngOnInit() {
    this.cantidad = this.rowData.requerimientoId.cantidadAprobada;
  }
}
