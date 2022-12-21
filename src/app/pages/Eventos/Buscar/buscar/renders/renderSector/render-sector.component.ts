import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ViewCell } from "ng2-smart-table";
@Component({
  selector: "ngx-render",
  template: `<i (click)="onClick()" class="{{ icono }} tamanoBoton"></i>`,
  styleUrls: ["./render-sector.component.scss"],
})
export class RenderSectorComponent implements ViewCell, OnInit {
  constructor() {}

  renderValue: string;
  @Input() value: string | number;
  icono: string = "nb-keypad";
  //@Input() icono: string;
  @Input() rowData: any;
  //rowData: any;

  @Output() eventData: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }

  onClick() {
    this.eventData.emit(this.rowData);
  }
}
