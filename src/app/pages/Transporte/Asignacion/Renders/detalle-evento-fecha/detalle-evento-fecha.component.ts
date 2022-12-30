import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ViewCell } from "ng2-smart-table";
@Component({
  selector: "ngx-detalle-evento-fecha",
  template: ` {{ fecha }}`,
  styleUrls: ["./detalle-evento-fecha.component.scss"],
})
export class DetalleEventoFechaComponent implements ViewCell, OnInit {
  constructor() {}
  renderValue: string;
  @Input() value: string | number;
  @Input() rowData: any;
  @Output() eventData: EventEmitter<any> = new EventEmitter();
  fecha: string = "";
  ngOnInit() {
    this.fecha = this.rowData.detalleEventoId.fecha;
  }
}
