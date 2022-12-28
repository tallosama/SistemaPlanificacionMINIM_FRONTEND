import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ViewCell } from "ng2-smart-table";
@Component({
  selector: "ngx-render-transporte",
  template: ` <i (click)="onClick()" class="{{ clase }} tamanoBoton"></i>`,
  styleUrls: ["./render-transporte.component.scss"],
})
export class RenderTransporteComponent implements ViewCell, OnInit {
  constructor() {}

  renderValue: string;
  @Input() value: string | number;
  @Input() rowData: any;
  @Output() eventData: EventEmitter<any> = new EventEmitter();
  clase: string = "	nb-location";
  ngOnInit() {}
  onClick() {
    this.eventData.emit(this.rowData);
  }
}