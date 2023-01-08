import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbDialogRef } from "@nebular/theme";
import { DialogNamePromptComponent } from "../../modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component";
import { Util } from "../Util";
@Component({
  selector: "ngx-mensaje-entrada",
  templateUrl: "./mensaje-entrada.component.html",
  styleUrls: ["./mensaje-entrada.component.scss"],
})
export class MensajeEntradaComponent implements OnInit {
  @Input() titulo: string;
  @Input() mensajeAdvertencia?: string;

  motivoAnulacionForm: FormGroup;
  constructor(
    protected ref: NbDialogRef<DialogNamePromptComponent>,
    public fb: FormBuilder
  ) { }
  ngOnInit(): void {
    this.motivoAnulacionForm = this.fb.group({
      motivoAnulacion: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(255),
          Util.esVacio,
        ]),
      ],
    });
  }
  public cancel(): void {
    this.ref.close(false);
  }

  public submit(): void {
    this.ref.close(this.motivoAnulacionForm.value.motivoAnulacion);
  }
}
