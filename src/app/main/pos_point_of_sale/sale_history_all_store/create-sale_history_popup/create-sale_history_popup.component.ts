import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {SaleHeaderHistoryDataModel} from "../sale_history_all_store.component";
import {HttpEvent, HttpEventType} from "@angular/common/http";
import * as FileSaver from 'file-saver';
import {NgxSpinnerService} from "ngx-spinner";
import {SignalR} from "../../../../../@pristine/process/SignalR";

@Component({
  selector: 'app-create-sale_history_popup',
  templateUrl: './create-sale_history_popup.component.html',
  styleUrls: ['./create-sale_history_popup.component.scss']
})
export class CreateSaleHistoryPopupComponent implements OnInit {
  email_enter: boolean = false;

  constructor(public dialogRef: MatDialogRef<CreateSaleHistoryPopupComponent>,
              private _toster: ToastrService,
              private webApiHttp: WebApiHttp,
              private sessionManageMent: SessionManageMent,
              private ngxSpinnerService: NgxSpinnerService,
              private _signalR:SignalR,
              @Inject(MAT_DIALOG_DATA) public data: PassData) {

  }

  today = new Date();

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

  @ViewChild('content') divcontent: ElementRef;

  pdfGenerate() {
    this.ngxSpinnerService.show();
    if (this.data.saleReturnData[0].sale_header[0].order_status == 'RETURNED') {
      this.webApiHttp.Get_Data_With_DownloadStatus_GetFile(this.webApiHttp.ApiURLArray.ReturnInvoiceReport + this.data.saleReturnData[0].sale_header[0].sale_header_no)
        .subscribe(async (event: HttpEvent<any>) => {
          try {
            switch (event.type) {
              case HttpEventType.Sent:
                break;
              case HttpEventType.ResponseHeader:
                break;
              case HttpEventType.DownloadProgress:
                break;
              case HttpEventType.Response:
                if (event.body.type == "application/pdf") {
                  FileSaver.saveAs(event.body, 'invoice_' + this.data.saleReturnData[0].sale_header[0].sale_header_no + '.pdf');
                  await this.downloadFile(event.body);
                  this.dialogRef.close();
                } else if (event.body.type == "application/json") {
                  const blb = new Blob([event.body], {type: "text/plain"});
                  var jsonresult = JSON.parse(this.webApiHttp.blobToString(blb));
                  if (jsonresult[0].condition.toUpperCase() == "FALSE") {
                    this._toster.error(jsonresult[0].message, "Error");
                  }
                }
                this.ngxSpinnerService.hide();
                break;
            }
          } catch (e) {
            console.log(e);
            this.ngxSpinnerService.hide();
          } finally {
          }
        }, error => {
          this.ngxSpinnerService.hide();
          console.log(error);
          this.dialogRef.close();
          if(error.status==401){
            this._signalR.stopSignalRConnection();
            localStorage.clear();
          }
        });

    } else {
      this.webApiHttp.Get_Data_With_DownloadStatus_GetFile(this.webApiHttp.ApiURLArray.SaleInvoiceReport + this.data.saleReturnData[0].sale_header[0].sale_header_no)
        .subscribe(async (event: HttpEvent<any>) => {
          try {
            switch (event.type) {
              case HttpEventType.Sent:
                break;
              case HttpEventType.ResponseHeader:
                break;
              case HttpEventType.DownloadProgress:
                break;
              case HttpEventType.Response:
                if (event.body.type == "application/pdf") {
                  FileSaver.saveAs(event.body, 'invoice_' + this.data.saleReturnData[0].sale_header[0].sale_header_no + '.pdf');
                  await this.downloadFile(event.body);
                  this.dialogRef.close();
                } else if (event.body.type == "application/json") {
                  const blb = new Blob([event.body], {type: "text/plain"});
                  var jsonresult = JSON.parse(this.webApiHttp.blobToString(blb));
                  if (jsonresult[0].condition.toUpperCase() == "FALSE") {
                    this._toster.error(jsonresult[0].message, "Error");
                  }
                }
                this.ngxSpinnerService.hide();
                break;
            }
          } catch (e) {
            console.log(e);
            this.ngxSpinnerService.hide();
          } finally {
          }
        }, error => {
          this.ngxSpinnerService.hide();
          this.dialogRef.close();
          console.log(error)
          if(error.status==401){
            this._signalR.stopSignalRConnection();
            localStorage.clear();
          }
        });
    }


    // let content = this.divcontent.nativeElement;
    // let printContents, popupWin;
    // printContents = content.innerHTML;
    // popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    // popupWin.document.open();
    // popupWin.document.write(
    //   `<style>
    //           table{
    //             width:100%;
    //           }
    //
    //           .tbl-content{
    //             overflow-x:auto;
    //             margin-top: 0px;
    //           }
    //           .tbl-content-header{
    //           }
    //           .tablestyle{
    //             border-collapse: collapse;
    //           }
    //
    //           th{
    //             padding: 15px 10px;
    //             border-bottom: 1px solid;
    //             /*border: 1px solid #ebeff5;*/
    //           }
    //           hr{
    //           color: black;
    //           height: 3px;
    //
    //           }
    //           .th1{
    //           padding-left: 200px;
    //           }
    //           .table-contentt{
    //           margin-left: 50%
    //           }
    //           td{
    //             padding: 10px;
    //             border-bottom: 1px solid;
    //             /*border: 1px solid #ebeff5;*/
    //             text-align:center;
    //           }
    //           tr:nth-child(even) {background-color: #f5f7fc;}
    //           tr:hover {background-color: #e6f3ff;}
    //           </style><body onload="window.print();">${printContents}</body>`
    // );
    // popupWin.document.close();
  }

  async downloadFile(data) {
    const blob = new Blob([data], {type: 'application/pdf'});
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = window.URL.createObjectURL(blob);
    document.body.appendChild(iframe);
    iframe.contentWindow.print();
  }
}

interface PassData {
  flag: string;
  saleReturnData: Array<SaleHeaderHistoryDataModel>;
}
