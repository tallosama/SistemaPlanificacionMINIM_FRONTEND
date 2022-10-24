import { Component, Input } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";

@Component({
  selector: "ngx-dialog-name-prompt",
  templateUrl: "dialog-name-prompt.component.html",
  styleUrls: ["dialog-name-prompt.component.scss"],
})
export class DialogNamePromptComponent {
  @Input() titulo: string;
  @Input() cuerpo: string;
  constructor(protected ref: NbDialogRef<DialogNamePromptComponent>) {}

  public cancel(): void {
    this.ref.close(false);
  }

  public submit(): void {
    this.ref.close(true);
  }
}
