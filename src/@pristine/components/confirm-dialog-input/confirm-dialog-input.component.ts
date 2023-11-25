import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'pristine-confirm-dialog-input',
  templateUrl: './confirm-dialog-input.component.html',
  styleUrls: ['./confirm-dialog-input.component.scss']
})
export class PristineConfirmDialogInputComponent {
  public confirmMessage: string;
  public inputFieldMessage: string;
  public addbutton: string = 'Add';

  /**
   * Constructor
   *
   * @param {MatDialogRef<PristineConfirmDialogComponent>} dialogRef
   */
  constructor(
    public dialogRef: MatDialogRef<PristineConfirmDialogInputComponent>
  ) {
  }

}
