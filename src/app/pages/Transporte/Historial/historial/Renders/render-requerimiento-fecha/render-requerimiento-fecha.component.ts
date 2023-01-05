import { Component, OnInit, Input } from "@angular/core";
import { ViewCell } from "ng2-smart-table";

@Component({
  selector: "ngx-render-requerimiento-fecha",
  template: "{{cantidad}}",
  styleUrls: ["./render-requerimiento-fecha.component.scss"],
})
export class RenderRequerimientoFechaComponent implements ViewCell, OnInit {
  constructor() {}

  renderValue: string;
  @Input() value: string | number;
  @Input() rowData: any;
  cantidad: string;
  ngOnInit() {
    this.cantidad = this.rowData.requerimientoId.detalleEventoId.fecha;
  }
}
