import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {FlexLayoutModule} from "@angular/flex-layout";
import {
  PristineConfirmDialogPOSTerminalComponent
} from "./confirm-dialog-pos_terminal.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    PristineConfirmDialogPOSTerminalComponent
  ],
  imports: [
    MatDialogModule,
    MatButtonModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  entryComponents: [
    PristineConfirmDialogPOSTerminalComponent
  ],
})
export class PristineConfirmDialogPOSTerminalModule {
}
