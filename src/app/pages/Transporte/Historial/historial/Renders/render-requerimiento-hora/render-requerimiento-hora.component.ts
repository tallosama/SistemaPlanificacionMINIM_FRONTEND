import { Component, OnInit, Input } from "@angular/core";
import { ViewCell } from "ng2-smart-table";

@Component({
  selector: "ngx-render-requerimiento-hora",
  template: "{{hora}}",
  styleUrls: ["./render-requerimiento-hora.component.scss"],
})
export class RenderRequerimientoHoraComponent implements ViewCell, OnInit {
  constructor() {}

  renderValue: string;
  @Input() value: string | number;
  @Input() rowData: any;
  hora: string;
  ngOnInit() {
    this.hora = this.rowData.requerimientoId.detalleEventoId.hora;
  }
}
