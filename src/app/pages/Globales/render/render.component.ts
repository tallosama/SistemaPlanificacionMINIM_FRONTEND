import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { NbDialogService } from "@nebular/theme";
import { ViewCell } from "ng2-smart-table";
import { PersonasAsignadasComponent } from "../../Eventos/Buscar/personas-asignadas/personas-asignadas.component";

@Component({
  selector: "ngx-render",
  template: `<i (click)="onClick()" class="nb-compose tamanoBoton"></i>`,
  styleUrls: ["./render.component.scss"],
})
export class RenderComponent implements ViewCell, OnInit {
  constructor() {}

  renderValue: string;
  @Input() value: string | number;
  @Input() rowData: any;

  @Output() eventData: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }

  onClick() {
    this.eventData.emit(this.rowData);
  }
}
