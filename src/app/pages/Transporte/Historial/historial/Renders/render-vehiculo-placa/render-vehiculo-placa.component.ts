import { Component, OnInit, Input } from "@angular/core";
import { ViewCell } from "ng2-smart-table";

@Component({
  selector: "ngx-render-vehiculo-placa",
  template: "{{placa}}",
  styleUrls: ["./render-vehiculo-placa.component.scss"],
})
export class RenderVehiculoPlacaComponent implements ViewCell, OnInit {
  constructor() {}

  renderValue: string;
  @Input() value: string | number;
  @Input() rowData: any;
  placa: string;
  ngOnInit() {
    this.placa = this.rowData.vehiculoId.placa;
  }
}
