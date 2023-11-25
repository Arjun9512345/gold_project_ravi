import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {pristineConfirmDialogComponent} from "./confirm-dialog.component";

@NgModule({
  declarations: [
    pristineConfirmDialogComponent
  ],
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  entryComponents: [
    pristineConfirmDialogComponent
  ],
})
export class pristineConfirmDialogModule {
}
