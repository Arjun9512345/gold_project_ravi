import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {ActivatedRoute, Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import * as FileSaver from 'file-saver';
import {pristineConfirmDialogComponent} from "../../../../../@pristine/components/confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-transfer_receive_by_user',
  templateUrl: './transfer_receive_by_user.component.html',
  styleUrls: ['./transfer_receive_by_user.component.scss']
})
export class Transfer_receive_by_userComponent implements OnInit {


  inputjson: { type: string, doc_no: string };
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<TransferOrderLineModel> = new MatTableDataSource<TransferOrderLineModel>([]);

  @ViewChild('mypaginationpaginator', {static: true}) mypaginationpaginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  locationlist: Array<Location_mstModel> = [];
  @ViewChild('ScanItemdata', {static: false}) ScanItemdata: ElementRef;

  constructor(public sessionManageMent: SessionManageMent,
              private webApiHttp: WebApiHttp,
              private _toster: ToastrService,
              private _encriptDecript: EncriptDecript,
              private router: Router,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService,
              private dialog: MatDialog) {


    this.inputjson = JSON.parse(this._encriptDecript.decrypt(this.route.snapshot.paramMap.get('response')));
    switch (this.inputjson.type) {
      case 'create':
        break;
      case 'Receive':
        this.get_TransferOrderDetail(this.inputjson.doc_no)
        break;
      case 'update':
        break;
    }
  }

  ngOnInit(): void {

  }

  item_info(row: TransferOrderLineModel) {
    this.router.navigate(['/pos_master/itemlist/itemview', {res: row.item_no}]);
  }


  get_TransferOrderDetail(documentno: string) {
    this.spinner.show();
    let json = {
      TransferNo: documentno
    }
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.TransferOrderInfo, json).then(result => {
      if (result.length > 0 && result[0].condition.toLowerCase() === 'true') {
        this.transferOrderDataList = result;

        if (this.transferOrderDataList[0].order_status == 'Transfer Posted') {
          this.displayedColumns = ['barcode', 'item_name', 'received_qty', 'ordered_quantity', 'transfer_cost', 'total_amount', 'gst_amount',
            'total_amount_with_gst', 'Action'];
        } else {
          this.displayedColumns = ['barcode', 'item_name', 'received_qty', 'ordered_quantity', 'shortage_qty', 'transfer_cost', 'total_amount', 'gst_amount',
            'total_amount_with_gst', 'Action'];
        }
        this.dataSource = new MatTableDataSource<TransferOrderLineModel>(this.transferOrderDataList[0].transfer_order_line);
        this.dataSource.paginator = this.mypaginationpaginator;
        this.dataSource.sort = this.sort;

      } else {
        this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
      }
    }).catch(e => {
      this._toster.error(e, 'Error');
    }).finally(() => {
      this.spinner.hide();
      setTimeout(function () {
        document.getElementById('myScanbarcodeId').focus();
      }, 100);
    })

  }

  transferOrderDataList: Array<TransferOrderModel> = [];


  ScanReceivedBarcode(scan_barcode_value: string) {

    this.ScanItemdata.nativeElement.disabled = true;
    this.spinner.show();
    const json = {
      transfer_no: this.transferOrderDataList[0].document_no,
      barcode: scan_barcode_value,
      location_id: this.sessionManageMent.getLocationId,
      email_id: this.sessionManageMent.getEmail
    }
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.TansferOrderReceivedScanBarcode, json).then(result => {
      if (result.length > 0 && result[0].condition.toLowerCase() === 'true') {
        this.transferOrderDataList = result;
        if (this.transferOrderDataList[0].order_status == 'Transfer Posted') {
          this.displayedColumns = ['barcode', 'item_name', 'received_qty', 'ordered_quantity', 'transfer_cost', 'total_amount', 'gst_amount',
            'total_amount_with_gst', 'Action'];
        } else {
          this.displayedColumns = ['barcode', 'item_name', 'received_qty', 'ordered_quantity', 'shortage_qty', 'transfer_cost', 'total_amount', 'gst_amount',
            'total_amount_with_gst', 'Action'];
        }

        this.dataSource = new MatTableDataSource<TransferOrderLineModel>(this.transferOrderDataList[0].transfer_order_line);
        this.dataSource.paginator = this.mypaginationpaginator;
        this.dataSource.sort = this.sort;

        this._toster.success(this.transferOrderDataList[0].message, 'Success')
      } else {
        this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');

      }
    }).catch(e => {
      this._toster.error(e, 'Error');
    }).finally(() => {
      this.spinner.hide();
      this.ScanItemdata.nativeElement.value = ''
      this.ScanItemdata.nativeElement.disabled = false;
      this.ScanItemdata.nativeElement.focus();
    });
  }

  total_sortage_qty():number{
    let sum:number=0;
    this.dataSource.data.forEach(item=>{
      sum+=(item.ordered_quantity-item.received_qty)
    })
    return sum;
  }
  complete_order() {
    let confirm_message: string = '';
    if (this.getTotalReceivedQty() < this.transferOrderDataList[0]?.total_quantity) {
      confirm_message = 'Scanned qty is less then total ordered qty. the total shortage qty is '+this.total_sortage_qty()+'. do you want to continue?'
    } else {
      confirm_message = 'Do you really want to Complete this document?'
    }
    var dialogConfig = this.dialog.open(pristineConfirmDialogComponent)
    dialogConfig.componentInstance.confirmMessage = confirm_message;
    dialogConfig.afterClosed().subscribe(result => {
      if (result == true) {
        this.spinner.show();

        const json = {
          transfer_no: this.transferOrderDataList[0].document_no,
          email_id: this.sessionManageMent.getEmail,
          location_id: this.sessionManageMent.getLocationId
        }

        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.TansferOrderReceivedComplete, json).then(async result => {
          if (result.length > 0 && result[0].condition.toLowerCase() === 'true') {
            this._toster.success(result[0].message, 'Success');
            this.transferOrderDataList = result;
            this.router.navigate(['/ordermanagement/receivetransferlist']);

            if (this.transferOrderDataList[0].order_status == 'Transfer Posted') {
              this.displayedColumns = ['barcode', 'item_name', 'received_qty', 'ordered_quantity', 'transfer_cost', 'total_amount', 'gst_amount',
                'total_amount_with_gst', 'Action'];
            } else {
              this.displayedColumns = ['barcode', 'item_name', 'received_qty', 'ordered_quantity', 'shortage_qty', 'transfer_cost', 'total_amount', 'gst_amount',
                'total_amount_with_gst', 'Action'];
            }

            this.dataSource = new MatTableDataSource<TransferOrderLineModel>(this.transferOrderDataList[0].transfer_order_line);
            this.dataSource.paginator = this.mypaginationpaginator;
            this.dataSource.sort = this.sort;

            // await this.webApiHttp.Get_Data_With_DownloadStatus_GetFile(this.webApiHttp.ApiURLArray.TransferOrderReport + this.transferOrderDataList[0].document_no + '&flag=TranferReceive')
            //   .subscribe(async (event: HttpEvent<any>) => {
            //     switch (event.type) {
            //       case HttpEventType.Sent:
            //         break;
            //       case HttpEventType.ResponseHeader:
            //         break;
            //       case HttpEventType.DownloadProgress:
            //         break;
            //       case HttpEventType.Response: {
            //         try {
            //           if (event.body.type == "application/pdf") {
            //             FileSaver.saveAs(event.body, 'report_' + this.transferOrderDataList[0].document_no + '.pdf');
            //             await this.downloadFile(event.body);
            //           } else if (event.body.type == "application/json") {
            //             const blb = new Blob([event.body], {type: "text/plain"});
            //             var jsonresult = JSON.parse(this.webApiHttp.blobToString(blb));
            //             if (jsonresult[0].condition.toUpperCase() == "FALSE") {
            //               this._toster.error(jsonresult[0].message, "Error");
            //             }
            //           }
            //           this.spinner.hide();
            //         } catch (e) {
            //           this.spinner.hide();
            //         }
            //         break;
            //       }
            //     }
            //   }, error => {
            //     this.spinner.hide();
            //   });
          } else {
            this.spinner.hide();
            this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
          }
        }).catch(e => {
          this._toster.error(e, 'Error');
          this.spinner.hide();
        })
      }
    });
  }

  async downloadFile(data) {
    const blob = new Blob([data], {type: 'application/pdf'});
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = window.URL.createObjectURL(blob);
    document.body.appendChild(iframe);
    iframe.contentWindow.print();
    this.router.navigate(['/ordermanagement/receivetransferlist']);
  }


  getTotalReceivedQty() {
    let sum = 0;
    for (let i = 0; i < this.dataSource.data.length; i++) {
      sum += this.dataSource.data[i].received_qty;
    }
    return sum;
  }
  getTotalPendingQty() {
    let sum = 0;
    for (let i = 0; i < this.dataSource.data.length; i++) {
      sum += (this.dataSource.data[i].ordered_quantity-this.dataSource.data[i].received_qty);
    }
    return sum;
  }

  getTotalTansferCost() {
    let sum = 0;
    for (let i = 0; i < this.dataSource.data.length; i++) {
      sum += this.dataSource.data[i].total_amount;
    }
    return sum;
  }

  getTotalTansferCostWithGst(): number {
    let sum = 0;
    for (let i = 0; i < this.dataSource.data.length; i++) {
      sum += this.dataSource.data[i].total_amount_with_gst;
    }
    return sum;
  }

  applyFilter(filterValue: string, keyName: string) {
    this.dataSource.filter = filterValue;
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      if (data[keyName] != undefined && data[keyName] != null && data[keyName] != '') {
        return (data[keyName] != null && data[keyName] != undefined ? data[keyName].toString().toLowerCase() : '').includes(filter.toLowerCase());
      } else {
        return false
      }

    };
  }


}


export class TransferOrderModel {
  completed_on: string;
  fromLocation: Array<Location_mstModel>;
  toLocation: Array<Location_mstModel>;
  condition: string;
  message: string;
  created_by: string;
  created_date: string;
  document_no: string;
  freight_type: string;
  from_location_id: string;
  gst_applicable: string;
  nav_message: string;
  nav_sync: string;
  order_status: string;
  recevied_by: string;
  reciept_date: string;
  ship_date: string;
  shipped_by: string;
  to_location_id: string;
  total_gst_amount: string;
  total_quantity: number;
  total_quantity_received: string;
  total_quantity_shipped: string;
  total_transfer_cost: number;
  total_transfer_cost_with_gst: number;
  public creation_type: string;
  transfer_order_line: Array<TransferOrderLineModel>;
}

export class TransferOrderLineModel {
  barcode: string;
  cgst_amount: string;
  cgst_percentage: string;
  document_line_no: string;
  document_no: string;
  good_qty: string;
  gst_amount: string;
  igst_amount: string;
  igst_percentage: string;
  item_no: string;
  order_status: string;
  received_qty: number;
  ordered_quantity: number;
  pick_ready_quantity: string;
  reservation_status: string;
  reserved_quantity: string;
  sgst_amount: string;
  sgst_percentage: string;
  total_amount: number;
  total_amount_with_gst: number;
  transfer_cost: number;
  updated_by: string;
  updated_on: string;
  received_qty_forcefully:string;
}

export class Location_mstModel {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  country: string;
  gst_type: string;
  gst_no: string;
  contact_no: string;
  email: string;
  price_group: string;
  is_ho: string;
}


export class ExcelUploadModel {
  item_no: string;
  barcode: string;
  ordered_quantity: string;
}
