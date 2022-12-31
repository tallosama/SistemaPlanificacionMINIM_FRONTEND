import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { NbDialogRef, NbDialogService, NbToastrService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { Subscription } from "rxjs-compat";
import { authService } from "../../../../../auth/auth.service";
import { ShowcaseDialogComponent } from "../../../../modal-overlays/dialog/showcase-dialog/showcase-dialog.component";

@Component({
  selector: "ngx-asignar-transporte",
  templateUrl: "./asignar-transporte.component.html",
  styleUrls: ["./asignar-transporte.component.scss"],
})
export class AsignarTransporteComponent implements OnInit, OnDestroy {
  @Input() requerimiento: any;
  subscripciones: Array<Subscription> = [];

  nuevosElementos = [];
  smartTransporteTotales: LocalDataSource = new LocalDataSource();
  smartTransporteAsignados: LocalDataSource = new LocalDataSource();
  settingsTransporteTotal = {
    mode: "external",
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },

    actions: {
      add: false,

      delete: false,
    },

    pager: {
      display: true,
      perPage: 5,
    },

    columns: {
      desSector: {
        title: "Descripción",
        type: "string",
      },

      anulacion: {
        title: "Estado",
        valuePrepareFunction: (data) => {
          return data ? "Inactivo" : "Activo";
        },
      },
      motivoAnulacion: {
        title: "Motivo",
        type: "string",
      },
    },
  };

  settingsTransporteAsinado = {
    mode: "external",

    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
    },
    actions: {
      add: false,
      edit: false,
    },

    pager: {
      display: true,
      perPage: 5,
    },

    columns: {
      desSector: {
        title: "Descripción",
        type: "string",
      },

      anulacion: {
        title: "Estado",
        valuePrepareFunction: (data) => {
          return data ? "Inactivo" : "Activo";
        },
      },
      motivoAnulacion: {
        title: "Motivo",
        type: "string",
      },
    },
  };
  constructor(
    protected ref: NbDialogRef<ShowcaseDialogComponent>,

    private toastrService: NbToastrService,
    private auth: authService,
    private dialogService: NbDialogService
  ) {}

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe());
  }
  cerrar() {
    this.ref.close();
  }
}
