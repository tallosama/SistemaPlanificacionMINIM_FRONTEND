import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ViewCell } from "ng2-smart-table";
@Component({
  selector: "ngx-render-materiales",
  template: `<i (click)="onClick()" class="{{ clase }} tamanoBoton"></i>`,
  styleUrls: ["./render-materiales.component.scss"],
})
export class RenderMaterialesComponent implements ViewCell, OnInit {
  constructor() {}

  renderValue: string;
  @Input() value: string | number;
  @Input() rowData: any;
  @Output() eventData: EventEmitter<any> = new EventEmitter();
  clase: string = "nb-e-commerce";
  ngOnInit() {}
  onClick() {
    this.eventData.emit(this.rowData);
  }
}
