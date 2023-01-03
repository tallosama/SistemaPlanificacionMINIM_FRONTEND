import { Component, OnInit, Input } from "@angular/core";
import { ViewCell } from "ng2-smart-table";

@Component({
  selector: "ngx-render-vehiculo-marca",
  template: "{{marca}}",
  styleUrls: ["./render-vehiculo-marca.component.scss"],
})
export class RenderVehiculoMarcaComponent implements ViewCell, OnInit {
  constructor() {}

  renderValue: string;
  @Input() value: string | number;
  @Input() rowData: any;
  marca: string;
  ngOnInit() {
    this.marca = this.rowData.vehiculoId.marca;
  }
}
