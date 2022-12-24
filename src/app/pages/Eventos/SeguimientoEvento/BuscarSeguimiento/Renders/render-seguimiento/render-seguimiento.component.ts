import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ViewCell } from "ng2-smart-table";
@Component({
  selector: "ngx-render-seguimiento",
  template: ` {{ hora }}`,
  styleUrls: ["./render-seguimiento.component.scss"],
})
export class RenderSeguimientoComponent implements ViewCell, OnInit {
  constructor() {}

  renderValue: string;
  @Input() value: string | number;
  @Input() rowData: any;
  @Output() eventData: EventEmitter<any> = new EventEmitter();
  hora: string = "";
  ngOnInit() {
    this.hora = this.rowData.detalleEventoId.hora;
  }
}
