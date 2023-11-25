import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { SaleReturnOrderDetail} from "../processSaleReturn.component";
import {ToastrService} from "ngx-toastr";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {HttpEvent, HttpEventType} from "@angular/common/http";
import * as FileSaver from 'file-saver';
import {NgxSpinnerService} from "ngx-spinner";
import {SignalR} from "../../../../../@pristine/process/SignalR";
@Component({
  selector: 'app-create-payment_return_page',
  templateUrl: './create-payment_return_page.component.html',
  styleUrls: ['./create-payment_return_page.component.scss']
})
export class CreatePayment_return_pageComponent implements OnInit {
  getTotal_Amount(amounnt:number):number{
    let round_value:number=Math.round(amounnt);
    return round_value;
  }
  getRounded_Amount(amounnt:number):number{
    let round_value:number=(Math.round(amounnt)-amounnt);
    return round_value;
  }

  FooterSection: string = '';

  constructor(public dialogRef: MatDialogRef<CreatePayment_return_pageComponent>,
              private _toster: ToastrService,
              private webApiHttp: WebApiHttp,
              private sessionManageMent: SessionManageMent,
              private ngxSpinnerService: NgxSpinnerService,
              private _signalR:SignalR,
              @Inject(MAT_DIALOG_DATA) public data: PassData) {

  }


  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

  OnsubmitHit(type: string) {
    this.ngxSpinnerService.show();
    const json = {
      so_no: this.data.sale_order_header_line_list[0].sale_header_no,
      pay_type: type,
      email_id: this.sessionManageMent.getEmail,
      store_id:  this.sessionManageMent.getLocationId
    }
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.pos_return_post, json).then(async (result) => {
      var response: Array<SaleReturnOrderDetail> = result;
      if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
        if(type=='CASH')
        this._toster.success('Successfully Order Returned.', 'Success');
        if(type=='CREDIT')
        this._toster.success('Credit note generated' + ' Your Credit Note is: ' + result[0].credit_no, 'Success');

        await this.webApiHttp.Get_Data_With_DownloadStatus_GetFile(this.webApiHttp.ApiURLArray.ReturnInvoiceReport+result[0].return_invoice_number)
          .subscribe(async (event: HttpEvent<any>) => {
            switch (event.type) {
              case HttpEventType.Sent:
                break;
              case HttpEventType.ResponseHeader:
                break;
              case HttpEventType.DownloadProgress:
                break;
              case HttpEventType.Response: {

                  if (event.body.type == "application/pdf") {
                    FileSaver.saveAs(event.body, 'invoice_' + result[0].return_invoice_number + '.pdf');
                    await this.downloadFile(event.body);
                  } else if (event.body.type == "application/json") {
                    const blb = new Blob([event.body], {type: "text/plain"});
                    var jsonresult = JSON.parse(this.webApiHttp.blobToString(blb));
                    if (jsonresult[0].condition.toUpperCase() == "FALSE") {
                      this._toster.error(jsonresult[0].message, "Error");
                      this.ngxSpinnerService.hide();
                    }
                  }
                break;
              }
            }
          }, error => {
            this._toster.error( result.message, 'Error');
            this.ngxSpinnerService.hide();
            this.dialogRef.close();
            if(error.status==401 ){
              this._signalR.stopSignalRConnection();
              localStorage.clear();
            }
          });


      } else {
        this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
        this.ngxSpinnerService.hide();
      }
    }).catch(error => {
      this._toster.error(error, 'Error');
      this.ngxSpinnerService.hide();
    }).finally(() => {
    });
  }
  async downloadFile(data) {
    const blob = new Blob([data], {type: 'application/pdf'});
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = window.URL.createObjectURL(blob);
    document.body.appendChild(iframe);
    iframe.contentWindow.print();
    this.ngxSpinnerService.hide();
    this.dialogRef.close(true);

  }
}

interface PassData {
  flag: string;
  sale_order_header_line_list: Array<SaleReturnOrderDetail>
}
