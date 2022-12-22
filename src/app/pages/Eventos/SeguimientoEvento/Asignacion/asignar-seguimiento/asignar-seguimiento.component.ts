import { Component, OnInit } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { ShowcaseDialogComponent } from "../../../../modal-overlays/dialog/showcase-dialog/showcase-dialog.component";

@Component({
  selector: "ngx-asignar-seguimiento",
  templateUrl: "./asignar-seguimiento.component.html",
  styleUrls: ["./asignar-seguimiento.component.scss"],
})
export class AsignarSeguimientoComponent implements OnInit {
  constructor(protected ref: NbDialogRef<ShowcaseDialogComponent>) {}

  ngOnInit(): void {}
  cerrar() {
    this.ref.close();
  }
}
