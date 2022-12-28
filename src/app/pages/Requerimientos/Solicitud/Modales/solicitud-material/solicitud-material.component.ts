import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs-compat";

@Component({
  selector: "ngx-solicitud-material",
  templateUrl: "./solicitud-material.component.html",
  styleUrls: ["./solicitud-material.component.scss"],
})
export class SolicitudMaterialComponent implements OnInit, OnDestroy {
  @Input() detalleEvento: any;
  subscripciones: Array<Subscription> = [];
  constructor() {}

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe());
  }
}
