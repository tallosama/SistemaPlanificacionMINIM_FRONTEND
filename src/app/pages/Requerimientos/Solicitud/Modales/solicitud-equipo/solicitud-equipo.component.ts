import { Component, Input, OnInit } from "@angular/core";
import { Subscription } from "rxjs-compat";

@Component({
  selector: "ngx-solicitud-equipo",
  templateUrl: "./solicitud-equipo.component.html",
  styleUrls: ["./solicitud-equipo.component.scss"],
})
export class SolicitudEquipoComponent implements OnInit {
  @Input() data: any;
  subscripciones: Array<Subscription> = [];
  constructor() {}

  ngOnInit(): void {}
}
