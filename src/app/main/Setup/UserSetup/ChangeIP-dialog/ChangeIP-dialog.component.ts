import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormControl, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";

@Component({
  selector: 'CreateUser-dialog-dialog',
  templateUrl: './ChangeIP-dialog.component.html',
  styleUrls: ['./ChangeIP-dialog.component.scss']
})
export class changeIPDialogComponent implements OnInit {
  public ipcontrol = new FormControl('', Validators.required);
  public portcontrol = new FormControl('', Validators.required);
  public email;

  constructor(
    public dialogRef: MatDialogRef<changeIPDialogComponent>,
    private webApiHttp: WebApiHttp,
    private pristineToaster: ToastrService
  ) {

  }

  ngOnInit(): void {

  }

  setipchange() {
    if (this.isnumeric(this.portcontrol) && this.ValidateIPaddress(this.ipcontrol)) {
      const json = {"Email": this.email, "PrinterIP": this.ipcontrol.value, "PrinterPort": this.portcontrol.value}
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.AddPrinterIPaddress, json).then(result => {
        let response: Array<{ condition: string; message: string }> = result;
        if (response[0].condition.toLowerCase() == 'true') {
          this.pristineToaster.success('', response[0].message);
          this.dialogRef.close(true);
        } else {
          this.pristineToaster.error('error', response[0].message)
        }
      }, error => this.pristineToaster.warning("Warn", 'Server Response Error')).catch(
        () => {
          this.pristineToaster.warning("Warn", 'Server Response Error')
        }
      )
    }
  }

  isnumeric(formcon: any): boolean {
    if (isNaN(formcon.value) || formcon.value.toString().includes('e') || formcon.value.toString().includes('.')) {
      this.pristineToaster.warning("Warn", 'Please Input Only numbers');
      formcon.setValue('9100');
      return false;
    }
    return true;
  }

  ValidateIPaddress(inputText: any) {
    var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (inputText.value.match(ipformat)) {
      return true;
    } else {
      this.pristineToaster.warning("Warn", 'You have entered an invalid IP address!');
      inputText.setValue('');
      return false;
    }
  }
}
