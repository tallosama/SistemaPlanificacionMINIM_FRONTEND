import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MensajeEntradaComponent } from "../mensaje-entrada/mensaje-entrada.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NbButtonModule,
  NbCardModule,
  NbDialogModule,
  NbInputModule,
} from "@nebular/theme";

@NgModule({
  declarations: [MensajeEntradaComponent],
  imports: [
    CommonModule,
    //permite utilizar peticiones http
    // HttpClientModule,
    //Permite usar los form builders
    ReactiveFormsModule,
    //Este modulo permite agregar codigo TS en los formularios
    FormsModule,
    //este es para las alertas
    //  NbAlertModule,

    //este es para los formularios
    NbInputModule,
    NbCardModule,
    NbButtonModule,

    NbDialogModule.forChild(),
  ],
})
export class MensajeEntradaModule {}
