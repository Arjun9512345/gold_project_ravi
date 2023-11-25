import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";

@Component({
  selector: 'app-barcodelist',
  templateUrl: './barcodelist.component.html',
  styleUrls: ['./barcodelist.component.scss']
})
export class BarcodelistComponent implements OnInit {
  barcodeList: Array<any>;
  pageNo: number = 0
  error: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<BarcodelistComponent>,
              private webApiHttp: WebApiHttp,
              public sessionManageMent: SessionManageMent,
              private _toster: ToastrService,
              private spinner: NgxSpinnerService) {
    this.barcode_list();
  }

  ngOnInit(): void {

  }


  send() {
    this.dialogRef.close();
  }

  next() {
    if (this.pageNo >= 0) {
      this.pageNo += 1;
      this.barcode_list();
    }
  }

  previous() {
    if (this.pageNo > 0) {
      this.pageNo -= 1;
      this.barcode_list();
    }
  }

  barcode_list() {
    try {
      this.spinner.show();
      const json = {
        LocationId: this.sessionManageMent.getLocationId,
        ItemNo: this.data.item_no,
        PageNo: this.pageNo
      }
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.BarcodeSerialNoList, json).then(
        result => {
          if (result[0].condition == 'True') {
            this.barcodeList = result;
            this.error = false;
          } else {
            this.error = true;
            this.pageNo -= 1;
            this._toster.warning(result[0].message, 'Message');
          }
          this.spinner.hide();
        }
      ).catch(e => {
        this.spinner.hide();
        this._toster.error(e, 'Error');
      })
    } catch (e) {
      this.spinner.hide();
      this._toster.error(e, 'Error');
    }
  }


}
