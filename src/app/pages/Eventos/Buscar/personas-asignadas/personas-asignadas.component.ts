import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { NbDialogRef, NbDialogService, NbToastrService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { Subscription } from "rxjs";
import { authService } from "../../../../auth/auth.service";
import { AreaService } from "../../../Catalogos/Area/area.service";
import { PersonaService } from "../../../Catalogos/Persona/persona.service";
import { MensajeEntradaComponent } from "../../../Globales/mensaje-entrada/mensaje-entrada.component";

import { Util } from "../../../Globales/Util";
import { DialogNamePromptComponent } from "../../../modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component";
import { ShowcaseDialogComponent } from "../../../modal-overlays/dialog/showcase-dialog/showcase-dialog.component";
import { detalleEventoPersonaPersonaService } from "./detalle-evento-persona.service";

@Component({
  selector: "ngx-personas-asignadas",
  templateUrl: "./personas-asignadas.component.html",
  styleUrls: ["./personas-asignadas.component.scss"],
})
export class PersonasAsignadasComponent implements OnInit, OnDestroy {
  @Input() data: any;
  subscripciones: Array<Subscription> = [];
  areas: any = [];
  personasAsignadas: any = [];

  keyword = "desArea";

  smartPersonalTotal: LocalDataSource = new LocalDataSource();
  smartPersonalAsignado: LocalDataSource = new LocalDataSource();

  settingsPersonalTotal = {
    mode: "external",
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    // delete: {
    //   deleteButtonContent: '<i class="nb-trash"></i>',
    // },
    actions: {
      add: false,

      delete: false,
    },

    pager: {
      display: true,
      perPage: 5,
    },
    columns: {
      cedula: {
        title: "Cédula",
        type: "string",
      },
      pNombre: {
        title: "Primer nombre",
        type: "string",
      },

      pApellido: {
        title: "Primer apellido",
        type: "string",
      },

      cargoId: {
        title: "Cargo",
        valuePrepareFunction: (data) => {
          return data.desCargo;
        },
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

  settingsPersonalAsignado = {
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
      cedula: {
        title: "Cédula",
        type: "string",
      },
      pNombre: {
        title: "Primer nombre",
        type: "string",
      },

      pApellido: {
        title: "Primer apellido",
        type: "string",
      },

      cargoId: {
        title: "Cargo",
        valuePrepareFunction: (data) => {
          return data.desCargo;
        },
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
    private personaService: PersonaService,
    private toastrService: NbToastrService,
    private areaService: AreaService,
    private depService: detalleEventoPersonaPersonaService,
    private auth: authService,
    private dialogService: NbDialogService
  ) {}
  ngOnInit(): void {
    this.llenadoListas();

    this.llenadoTablaPersonaAsignada();
  }
  ngOnDestroy(): void {
    this.subscripciones.forEach((s) => s.unsubscribe());
  }
  //Arreglo que contiene los detalles eventos persona
  listaDetallesPersona = [];
  //Variable que se vuelve true cuando ya existe personal en ese detalle (para que los siguientes registros se actualicen)
  tablaEsllenadoDB: boolean = false;
  //Llena la tabla de las personas que hayan sido asignadas a ese evento seleccionado
  public llenadoTablaPersonaAsignada() {
    this.subscripciones.push(
      this.depService
        .listarPorDetalleEvento(this.data.idDetalleEvento)
        .subscribe(
          (resp) => {
            this.listaDetallesPersona = resp;
            resp.forEach((r) => {
              this.tablaEsllenadoDB = true;
              this.smartPersonalAsignado.add(r.personaId);
            });
            this.smartPersonalAsignado.refresh();
          },
          (error) => {
            console.error(error);
            Util.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se listaban las personas asignadas " + error.error[0],

              0,
              this.toastrService
            );
          }
        )
    );
  }
  //Arreglo que permitirá que se agreguen nuevos registros en caso de que la tabla de personal asignado ya tuviera registros existentes
  nuevosElementos = [];
  public async agregarATablaPersonalAsignado(elemento) {
    await this.smartPersonalAsignado
      .getAll()
      .then((lista) => {
        //búsqueda en la tabla de personal asignado si ya existe la persona que se selecciona muestra un toast avisando al usuario y no lo agrega a la tabla
        if (
          lista.find((p) => p.idPersona === elemento.data.idPersona) == null
        ) {
          this.smartPersonalAsignado.add(elemento.data);
          this.smartPersonalAsignado.refresh();
          //Si la tabla ya poseía registros, significa una actualización, por lo tanto se agregan al arreglo nuevos elementos
          if (this.tablaEsllenadoDB) {
            this.nuevosElementos.push(elemento.data);
          }
        } else
          Util.showToast(
            "warning",
            "Advertencia",
            "Ya está asignada esta persona en la tabla",

            8000,
            this.toastrService
          );
      })
      .catch((e) => {
        Util.showToast(
          "danger",
          "Error",
          "Mientras se agregaba personal se detectó " + e,

          8000,
          this.toastrService
        );
        console.error(e);
      });
  }
  public quitar(elemento) {
    if (this.tablaEsllenadoDB) {
      let detallePersona = this.listaDetallesPersona.find(
        (e) => e.personaId.idPersona === elemento.data.idPersona
      );

      if (detallePersona != null) {
        this.confirmacionAnular(detallePersona);
      } else {
        this.smartPersonalAsignado.remove(elemento.data);
        this.smartPersonalAsignado.refresh();

        let index = this.nuevosElementos.indexOf(elemento.data, 0);
        this.nuevosElementos.splice(index, 1);
      }
    } else {
      this.smartPersonalAsignado.remove(elemento.data);
      this.smartPersonalAsignado.refresh();
    }
  }
  confirmacionAnular(elemento): void {
    let mensaje: string = elemento.anulacion //detalle evento persona
      ? "¿Desea reactivar el registro?"
      : "¿Desea anular el registro?";

    this.subscripciones.push(
      this.dialogService
        .open(MensajeEntradaComponent, {
          context: {
            titulo: mensaje,
          },
        })
        .onClose.subscribe((res) => {
          if (res) {
            this.anular(
              elemento,
              "'" +
                res +
                "', por " +
                this.auth.getUserStorage().email +
                " el " +
                new Date().toLocaleString()
            );
          }
        })
    );
  }

  anular(elemento: any, motivoAnulacion: string): void {
    this.subscripciones.push(
      this.depService
        .anular(elemento.idDetalleEventoPersona, motivoAnulacion)
        .subscribe(
          (res) => {
            let mensaje: string = res.anulacion
              ? "Se ha anulado el registro"
              : "Se ha reactivado el registro";

            Util.showToast(
              "success",
              "Acción realizada",
              mensaje,
              4000,
              this.toastrService
            );

            this.reconstruirDetalleAsignados(elemento, res);
          },
          (error) => {
            console.error(error);
            Util.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se anulaba el registro" + error.error[0],
              0,
              this.toastrService
            );
          }
        )
    );
  }
  reconstruirDetalleAsignados(elementoAnterior: any, elementoNuevo: any): void {
    let index = this.listaDetallesPersona.indexOf(elementoAnterior, 0);
    this.listaDetallesPersona.splice(index, 1);

    this.listaDetallesPersona.push(elementoNuevo);
  }

  private validarHorasEncontradas(e, cantidad: number, listaHoras) {
    let guard: boolean = true;
    let iteracion: number = 0;
    while (guard && iteracion != cantidad) {
      let horaDetalleEvento: number = Util.getHoraDate(
        this.data.hora
      ).getHours();
      let horaLista: number = Util.getHoraDate(
        listaHoras[iteracion]
      ).getHours();

      if (horaDetalleEvento > horaLista) {
        let resultado: number = horaDetalleEvento - horaLista;
        if (resultado < 3) {
          guard = false;
        }
      } else if (horaLista > horaDetalleEvento) {
        let resultado: number = horaLista - horaDetalleEvento;
        if (resultado < 3) {
          guard = false;
        }
      } else {
        guard = false;
      }
      iteracion++;
    }

    if (!guard) {
      this.subscripciones.push(
        this.dialogService
          .open(DialogNamePromptComponent, {
            context: {
              titulo: "Atención",
              cuerpo:
                e.pNombre +
                " " +
                e.pApellido +
                " posee " +
                cantidad +
                " eventos en la misma fecha, donde algunos poseen menos de 3 horas de diferencia, ¿Desea proceder?",
            },
          })
          .onClose.subscribe((res) => {
            if (res) {
              this.guardarDetalles(e);
            } else {
              this.smartPersonalAsignado.remove(e);
              this.smartPersonalAsignado.refresh();
            }
          })
      );
    } else {
      this.guardarDetalles(e);
    }
  }

  public async actualizarDetalles() {
    await this.nuevosElementos.forEach((e) => {
      this.busquedaHorasEventosUsuarios(e);
    });
    this.nuevosElementos = [];
  }

  public async grabarDetalles() {
    //empty vacia el smart
    await this.smartPersonalAsignado
      .getAll()
      .then((lista) => {
        lista.forEach((e) => {
          this.busquedaHorasEventosUsuarios(e);
        });
      })
      .catch((error) => {
        console.error(error);
        Util.showToast(
          "danger",
          "Error " + error.status,
          "Mientras se obtenian los registros seleccionados " + error.error[0],

          0,
          this.toastrService
        );
      });
  }

  private busquedaHorasEventosUsuarios(e) {
    this.subscripciones.push(
      this.depService
        .horasPorPersonaDetalleEvento(e.idPersona, this.data.fecha)
        .subscribe(
          (r) => {
            let cantidad: number = r.length;
            if (cantidad >= 1) {
              this.validarHorasEncontradas(e, cantidad, r);
            } else {
              this.guardarDetalles(e);
            }
          },
          (error) => {
            Util.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se verificaban las fechas del/los usuario/s a guardar " +
                error.error[0],

              0,
              this.toastrService
            );
          }
        )
    );
  }
  public guardarDetalles(e) {
    this.subscripciones.push(
      this.depService
        .guardar({
          detalleEventoId: this.data,
          personaId: e,
          anulacion: false,
          motivoAnulacion: "",
        })
        .subscribe(
          (r) => {
            Util.showToast(
              "success",
              "Acción realizada",
              "Se ha ingresado el registro",
              4000,
              this.toastrService
            );
            this.tablaEsllenadoDB = true;
            this.listaDetallesPersona.push(r);
          },
          (error) => {
            console.error(error);
            Util.showToast(
              "danger",
              "Error " + error.status,
              "Mientras se guardaban los registros " + error.error[0],

              0,
              this.toastrService
            );
          }
        )
    );
  }

  //Llenado del combo de area
  public llenadoListas() {
    this.subscripciones.push(
      this.areaService.listar().subscribe(
        (resp) => {
          this.areas = resp;
        },
        (error) => {
          console.error(error);
          Util.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaban las áreas " + error.error[0],

            0,
            this.toastrService
          );
        }
      )
    );
  }
  public reconstruirPersonalTotal(area) {
    this.subscripciones.push(
      this.personaService.listarPorArea(area.idArea).subscribe(
        (resp: any) => {
          this.smartPersonalTotal.load(resp);
          this.smartPersonalTotal.refresh();
        },
        (error) => {
          console.error(error);
          Util.showToast(
            "danger",
            "Error " + error.status,
            "Mientras se listaba el personal " + error.error[0],
            0,
            this.toastrService
          );
        }
      )
    );
  }

  cerrar() {
    this.ref.close();
  }
}
