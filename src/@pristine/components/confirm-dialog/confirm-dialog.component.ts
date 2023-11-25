import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'pristine-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class pristineConfirmDialogComponent {
  public confirmMessage: string;

  /**
   * Constructor
   *
   * @param {MatDialogRef<pristineConfirmDialogComponent>} dialogRef
   */
  constructor(
    public dialogRef: MatDialogRef<pristineConfirmDialogComponent>
  ) {
  }

}
