import { Component, OnInit, Input } from "@angular/core";
import { ViewCell } from "ng2-smart-table";
@Component({
  selector: "ngx-render-requerimiento-evento",
  template: "{{desEvento}}",
  styleUrls: ["./render-requerimiento-evento.component.scss"],
})
export class RenderRequerimientoEventoComponent implements ViewCell, OnInit {
  constructor() {}

  renderValue: string;
  @Input() value: string | number;
  @Input() rowData: any;
  desEvento: string;
  ngOnInit() {
    this.desEvento =
      this.rowData.requerimientoId.detalleEventoId.eventoId.desEvento;
  }
}
