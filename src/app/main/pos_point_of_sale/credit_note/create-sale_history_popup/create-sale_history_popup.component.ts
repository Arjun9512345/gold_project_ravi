import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";

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
              @Inject(MAT_DIALOG_DATA) public data: PassData) {

  }
  today=new Date();

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }
  @ViewChild('content') divcontent: ElementRef;
  pdfGenerate(){
    let content = this.divcontent.nativeElement;
    let printContents, popupWin;
    printContents = content.innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(
      `<style>
              table{
                width:100%;
              }

              .tbl-content{
                overflow-x:auto;
                margin-top: 0px;
              }
              .tbl-content-header{
              }
              .tablestyle{
                border-collapse: collapse;
              }

              th{
                padding: 15px 10px;
                border-bottom: 1px solid;
                /*border: 1px solid #ebeff5;*/
              }
              hr{
              color: black;
              height: 3px;

              }
              .th1{
              padding-left: 200px;
              }
              .table-contentt{
              margin-left: 50%
              }
              td{
                padding: 10px;
                border-bottom: 1px solid;
                /*border: 1px solid #ebeff5;*/
                text-align:center;
              }
              tr:nth-child(even) {background-color: #f5f7fc;}
              tr:hover {background-color: #e6f3ff;}
              </style><body onload="window.print();">${printContents}</body>`
    );
    popupWin.document.close();
  }

}

interface PassData {
  flag: string;
  saleReturnData: Array<any>;
  header_no:string;
}
