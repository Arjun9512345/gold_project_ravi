import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'pristine-confirm-dialog-input',
  templateUrl: './confirm-dialog-pos_terminal.component.html',
  styleUrls: ['./confirm-dialog-pos_terminal.component.scss']
})
export class PristineConfirmDialogPOSTerminalComponent {
  public confirmMessage: string;
  public inputFieldMessage: string;
  public inputemailMessage: string;
  public addbutton: string = 'Add';
  public  pass_update_computer_desc:string;
  public  pass_update_email:string;

  /**
   * Constructor
   *
   * @param {MatDialogRef<PristineConfirmDialogComponent>} dialogRef
   */
  constructor(
    public dialogRef: MatDialogRef<PristineConfirmDialogPOSTerminalComponent>
  ) {
  }

}
