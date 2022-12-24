import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ViewCell } from "ng2-smart-table";
@Component({
  selector: "ngx-render-seguimiento-municipio",
  template: "{{municipio}}",
  styleUrls: ["./render-seguimiento-municipio.component.scss"],
})
export class RenderSeguimientoMunicipioComponent implements ViewCell, OnInit {
  constructor() {}

  renderValue: string;
  @Input() value: string | number;
  @Input() rowData: any;
  @Output() eventData: EventEmitter<any> = new EventEmitter();
  municipio: string = "";
  ngOnInit() {
    this.municipio = this.rowData.detalleEventoId.municipioId.desMunicipio;
  }
}
