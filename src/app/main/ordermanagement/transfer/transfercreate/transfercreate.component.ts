import {FormBuilder, FormGroup} from "@angular/forms";
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
import {HttpEvent, HttpEventType} from "@angular/common/http";
import * as FileSaver from 'file-saver';
import {
  pristineConfirmDialogComponent
} from "../../../../../@pristine/components/confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import * as XLSX from "xlsx";
import {ExcelService} from "../../../../../@pristine/process/excel.Service";
import {DatePipe} from "@angular/common";
import {SignalR} from "../../../../../@pristine/process/SignalR";

@Component({
  selector: 'app-transfercreate',
  templateUrl: './transfercreate.component.html',
  styleUrls: ['./transfercreate.component.scss']
})
export class TransfercreateComponent implements OnInit {
//todo irn Input
  irn_cancel_reason: string = '';
  irn_cancelremark: string = '';
//todo eway bill input
  Transin: string = '';
  temp_name_of_transpoter: string = '';
  name_of_transpoter: string = '';
  TransMode: string = '';
  TransDocNo: string = '';
  TransDocDt: string = '';
  VehNo: string = '';
  VehType: string = '';
  //todo e-way cancel
  e_way_cancel_reason: string = '';
  e_way_cancelremarktemp: string = '';

  arrayBuffer: any;
  upload_excel_file: Array<ExcelUploadModel> = [];
  upload_excel_displayedColumns: string[] = ['item_no', 'barcode', 'ordered_quantity'];
  upload_excel_dataSource: MatTableDataSource<ExcelUploadModel> = new MatTableDataSource<ExcelUploadModel>([]);
  @ViewChild('upload_excel_paginator', {static: true}) upload_excel_paginator: MatPaginator;
  inputjson: { type: string, doc_no: string };
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<TransferOrderLineModel> = new MatTableDataSource<TransferOrderLineModel>([]);
  @ViewChild('mypaginationpaginator', {static: true}) mypaginationpaginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  AddItem: FormGroup;
  locationlist: Array<Location_mstModel> = [];
  @ViewChild('ScanItemdata', {static: false}) ScanItemdata: ElementRef;
  transpoter_list: Array<{ code: string, name: string, gsT_Registration_No: string }> = [];
  filter_transpoter_list: Array<{ code: string, name: string, gsT_Registration_No: string }> = [];
  transferOrderDataList: Array<TransferOrderModel> = [];

  constructor(public sessionManageMent: SessionManageMent,
              private webApiHttp: WebApiHttp,
              private _formBuilder: FormBuilder,
              private _toster: ToastrService,
              private _encriptDecript: EncriptDecript,
              private router: Router,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService,
              private dialog: MatDialog,
              private datepipe: DatePipe,
              private _signalR: SignalR,
              private excelService: ExcelService) {
    this.AddItem = _formBuilder.group({
      ToLocation: [''],
      FromLocation: [''],
      freight_type: [''],
    });


    this.inputjson = JSON.parse(this._encriptDecript.decrypt(this.route.snapshot.paramMap.get('response')));
    switch (this.inputjson.type) {
      case 'create':
        this.get_location();
        if (this.inputjson.doc_no != null && this.inputjson.doc_no != undefined && this.inputjson.doc_no != '')
          this.get_TransferOrderDetail(this.inputjson.doc_no)
        this.AddItem.get("FromLocation").setValue(this.sessionManageMent.getLocationName + ' ( ' + this.sessionManageMent.getLocationId + ' )');
        break;
      case 'view':
        this.get_TransferOrderDetail(this.inputjson.doc_no)
        this.AddItem.get("FromLocation").setValue(this.sessionManageMent.getLocationName + ' ( ' + this.sessionManageMent.getLocationId + ' )');
        break;
      case 'update':
        break;
    }
  }

  downloadSampleDoc() {
    const json = [{
      item_no: null,
      barcode: null,
      ordered_quantity: null
    }]
    this.excelService.exportAsExcelFile(json, "Item_sample");
  }

  uploadTranferOrderLineFile() {
    var input_element: any = document.createElement('input');
    input_element.setAttribute('type', 'file');
    input_element.click();
    input_element.addEventListener('change', event => {
      var file = event.target.files[0];
      this.spinner.show();
      if (file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type == 'application/vnd.ms-excel') {

        try {
          let fileReader = new FileReader();
          fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = [];
            for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, {type: "binary"});
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            // console.log(XLSX.utils.sheet_to_json(worksheet, {raw: true}));
            var uploaded_data: Array<ExcelUploadModel> = XLSX.utils.sheet_to_json(worksheet, {raw: true});
            if (uploaded_data.length <= 0) {
              this.upload_excel_file = [];
              this.spinner.hide();
              this._toster.error('Error', 'Excel File Is Empty.');
            } else {
              this.upload_excel_file = uploaded_data;
              this.upload_excel_dataSource = new MatTableDataSource<ExcelUploadModel>(this.upload_excel_file);
              this.upload_excel_dataSource.paginator = this.upload_excel_paginator;
              this.spinner.hide();
              console.log(this.upload_excel_file)
            }
          };
          fileReader.readAsArrayBuffer(file);

        } catch (error) {
          this.spinner.hide();
          this._toster.error('Error', 'File is Not Readable');
        }
      } else {
        this.spinner.hide();
        this._toster.error('Error', `Please Select only Excel file`);
      }
    });
  }

  RemoveExcle() {
    this.upload_excel_file = [];
    this.upload_excel_dataSource = new MatTableDataSource<ExcelUploadModel>(this.upload_excel_file);
    this.upload_excel_dataSource.paginator = this.upload_excel_paginator;
  }

  excel_post_to_server() {
    var json = {
      flag: "InsertFromExcel",
      transfer_order_no: this.transferOrderDataList[0].document_no,
      email: this.sessionManageMent.getEmail,
      transferOrderHeader: [],
      transferOrderLines: []
    }
    let lines: Array<{
      document_no: string; item_no: string; barcode: string;
      ordered_quantity: string; updated_on: string; updated_by: string
    }> = [];
    for (let i = 0; i < this.upload_excel_dataSource.data.length; i++) {

      lines.push({
        document_no: this.transferOrderDataList[0].document_no,
        item_no: this.upload_excel_dataSource.data[i].item_no,
        barcode: this.upload_excel_dataSource.data[i].barcode,
        ordered_quantity: this.upload_excel_dataSource.data[i].ordered_quantity,
        updated_on: this.datepipe.transform(new Date(), 'MM/dd/yyyy'),
        updated_by: this.sessionManageMent.getEmail
      });
    }

    if (lines.length <= 0) {
      this._toster.error('Please Add Minimum Single Line.', 'Error');
      return;
    } else {
      json.transferOrderLines = lines;
    }
    var dialogConfig = this.dialog.open(pristineConfirmDialogComponent)
    dialogConfig.componentInstance.confirmMessage = 'You want to upload Excel.';
    dialogConfig.afterClosed().subscribe(result => {
      if (result == true) {
        this.spinner.show();
        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.TransferOrderNavInsert, json).then(result => {
          if (result.length > 0 && result[0].condition.toLowerCase() === 'true') {
            this.upload_excel_file = [];
            this.upload_excel_dataSource = new MatTableDataSource<ExcelUploadModel>(this.upload_excel_file);
            this.upload_excel_dataSource.paginator = this.upload_excel_paginator;
            this.transferOrderDataList = result;
            if (this.transferOrderDataList[0].order_status == 'Pending') {
              this.displayedColumns = ['barcode', 'item_name', 'ordered_quantity', 'transfer_cost', 'total_amount', 'gst_amount',
                'total_amount_with_gst', 'Action'];
            } else {
              this.displayedColumns = ['barcode', 'item_name', 'ordered_quantity', 'received_qty', 'shortage_qty', 'transfer_cost', 'total_amount', 'gst_amount',
                'total_amount_with_gst', 'Action'];
            }
            if (this.transferOrderDataList[0].transfer_order_line.length > 0 &&
              this.transferOrderDataList[0].transfer_order_line[0].barcode != null
              && this.transferOrderDataList[0].transfer_order_line[0].barcode != undefined
              && this.transferOrderDataList[0].transfer_order_line[0].barcode != '') {
              this.dataSource = new MatTableDataSource<TransferOrderLineModel>(this.transferOrderDataList[0].transfer_order_line);
              this.dataSource.paginator = this.mypaginationpaginator;
              this.dataSource.sort = this.sort;
            } else {
              this.dataSource = new MatTableDataSource<TransferOrderLineModel>([]);
              this.dataSource.paginator = this.mypaginationpaginator;
              this.dataSource.sort = this.sort;
            }
            this._toster.success('Excel Upload Successfully.', 'Success');
          } else {
            this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
          }
        }).catch(e => {
          this._toster.error(e, 'Error');
        }).finally(() => {
          this.spinner.hide();
          this.ScanItemdata.nativeElement.focus();
        });
      }
    });

  }

  ngOnInit(): void {
    this.getTranspoterDetail();
  }

  getTranspoterDetail() {
    this.spinner.show();
    this.webApiHttp.Get(this.webApiHttp.ApiURLArray.einvoice_GetTranspoter).then(result => {
      this.transpoter_list = result;
    }).finally(() => {
      this.spinner.hide();
    });
  }

  item_info(row: TransferOrderLineModel) {
    this.router.navigate(['/pos_master/itemlist/itemview', {res: row.item_no}]);
  }

  get_location() {
    this.spinner.show();
    this.webApiHttp.Get(this.webApiHttp.ApiURLArray.locationlist).then(result => {
      this.locationlist = result as any[];
    }).catch(e => {
      this._toster.error(e, 'Error');
    }).finally(() => {
      this.spinner.hide();
    })

  }

  get_TransferOrderDetail(documentno: string) {
    this.irn_cancel_reason = ''
    this.irn_cancelremark = '';
    this.spinner.show();
    let json = {
      TransferNo: documentno
    }
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.TransferOrderInfo, json).then(result => {
      if (result.length > 0 && result[0].condition.toLowerCase() === 'true') {
        this.transferOrderDataList = result;
        if (this.transferOrderDataList[0].irn_genrated > 0 && this.transferOrderDataList[0].irn_canceled > 0) {
          this.irn_cancel_reason = this.transferOrderDataList[0].irn_cancel_reason;
          this.irn_cancelremark = this.transferOrderDataList[0].irn_cancel_remark;
        }
        if (this.transferOrderDataList[0].order_status == 'Pending') {
          this.displayedColumns = ['barcode', 'item_name', 'ordered_quantity', 'transfer_cost', 'total_amount', 'gst_amount',
            'total_amount_with_gst', 'Action'];
        } else {
          this.displayedColumns = ['barcode', 'item_name', 'ordered_quantity', 'received_qty', 'shortage_qty', 'transfer_cost', 'total_amount', 'gst_amount',
            'total_amount_with_gst', 'Action'];
        }
        if (this.transferOrderDataList[0].transfer_order_line.length > 0 &&
          this.transferOrderDataList[0].transfer_order_line[0].barcode != null
          && this.transferOrderDataList[0].transfer_order_line[0].barcode != undefined
          && this.transferOrderDataList[0].transfer_order_line[0].barcode != '') {
          this.dataSource = new MatTableDataSource<TransferOrderLineModel>(this.transferOrderDataList[0].transfer_order_line);
          this.dataSource.paginator = this.mypaginationpaginator;
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource = new MatTableDataSource<TransferOrderLineModel>([]);
          this.dataSource.paginator = this.mypaginationpaginator;
          this.dataSource.sort = this.sort;
        }


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


  GetPending(ordered_quantity, received_qty): number {
    let output = (parseInt(ordered_quantity) - parseInt(received_qty))
    return output;
  }

  new_tranfer_no() {
    if (this.AddItem.get('ToLocation').value == '' || this.AddItem.get('ToLocation').value == this.sessionManageMent.getLocationId) {
      this._toster.warning('Select Different Location', 'Warning');
      return;
    }
    // if (this.AddItem.get("freight_type").value == "") {
    //   this._toster.error('Please Enter Freight Type.', 'Error');
    //   return;
    // }
    this.spinner.show();
    var json = {
      email_id: this.sessionManageMent.getEmail,
      FromLocation: this.sessionManageMent.getLocationId,
      ToLocation: this.AddItem.get("ToLocation").value,
      freight_type: ''//this.AddItem.get("freight_type").value
    }
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.NewTransferOrderHeader, json).then(result => {
      if (result.length > 0 && result[0].condition.toLowerCase() === 'true') {
        this.transferOrderDataList = result;
        if (this.transferOrderDataList[0].order_status == 'Pending') {
          this.displayedColumns = ['barcode', 'item_name', 'ordered_quantity', 'transfer_cost', 'total_amount', 'gst_amount',
            'total_amount_with_gst', 'Action'];
        } else {
          this.displayedColumns = ['barcode', 'item_name', 'ordered_quantity', 'received_qty', 'shortage_qty', 'transfer_cost', 'total_amount', 'gst_amount',
            'total_amount_with_gst', 'Action'];
        }
        if (this.transferOrderDataList[0].transfer_order_line.length > 0 &&
          this.transferOrderDataList[0].transfer_order_line[0].barcode != null
          && this.transferOrderDataList[0].transfer_order_line[0].barcode != undefined
          && this.transferOrderDataList[0].transfer_order_line[0].barcode != '') {
          this.dataSource = new MatTableDataSource<TransferOrderLineModel>(this.transferOrderDataList[0].transfer_order_line);
          this.dataSource.paginator = this.mypaginationpaginator;
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource = new MatTableDataSource<TransferOrderLineModel>([]);
          this.dataSource.paginator = this.mypaginationpaginator;
          this.dataSource.sort = this.sort;
        }
        this.router.navigate(['/ordermanagement/transfercreate', {
          response: this._encriptDecript.encrypt(JSON.stringify({
            doc_no: this.transferOrderDataList[0].document_no,
            type: 'create'
          }))
        }]);

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

  addnewitem(scan_barcode_value: string) {

    this.ScanItemdata.nativeElement.disabled = true;
    this.spinner.show();
    const json = {
      transfer_order_no: this.transferOrderDataList[0].document_no,
      barcode: scan_barcode_value,
      Quantity: 1,
      email_id: this.sessionManageMent.getEmail
    }
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.AddNewItem, json).then(result => {
      if (result.length > 0 && result[0].condition.toLowerCase() === 'true') {
        this.transferOrderDataList = result;
        if (this.transferOrderDataList[0].order_status == 'Pending') {
          this.displayedColumns = ['barcode', 'item_name', 'ordered_quantity', 'transfer_cost', 'total_amount', 'gst_amount',
            'total_amount_with_gst', 'Action'];
        } else {
          this.displayedColumns = ['barcode', 'item_name', 'ordered_quantity', 'received_qty', 'shortage_qty', 'transfer_cost', 'total_amount', 'gst_amount',
            'total_amount_with_gst', 'Action'];
        }
        if (this.transferOrderDataList[0].transfer_order_line.length > 0 &&
          this.transferOrderDataList[0].transfer_order_line[0].barcode != null
          && this.transferOrderDataList[0].transfer_order_line[0].barcode != undefined
          && this.transferOrderDataList[0].transfer_order_line[0].barcode != '') {
          this.dataSource = new MatTableDataSource<TransferOrderLineModel>(this.transferOrderDataList[0].transfer_order_line);
          this.dataSource.paginator = this.mypaginationpaginator;
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource = new MatTableDataSource<TransferOrderLineModel>([]);
          this.dataSource.paginator = this.mypaginationpaginator;
          this.dataSource.sort = this.sort;
        }
        this._toster.success('Item Scan Successfully.', 'Success')
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

  complete_order() {
    if (this.dataSource.data.length <= 0) {
      this._toster.error('Please Scan Minimum Single Line.', 'Error');
      return;
    }

    this.spinner.show();

    const json = {
      TransferNo: this.transferOrderDataList[0].document_no,
      CreatedBy: this.sessionManageMent.getEmail,
      FromLocation: this.sessionManageMent.getLocationId
    }

    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.CompleteTransfer, json).then(async result => {
      if (result.length > 0 && result[0].condition.toLowerCase() === 'true') {
        this._toster.success(result[0].message, 'Success');
        this.router.navigate(['/ordermanagement/transferlist']);
        this.transferOrderDataList = result;
        if (this.transferOrderDataList[0].order_status == 'Pending') {
          this.displayedColumns = ['barcode', 'item_name', 'ordered_quantity', 'transfer_cost', 'total_amount', 'gst_amount',
            'total_amount_with_gst', 'Action'];
        } else {
          this.displayedColumns = ['barcode', 'item_name', 'ordered_quantity', 'received_qty', 'shortage_qty', 'transfer_cost', 'total_amount', 'gst_amount',
            'total_amount_with_gst', 'Action'];
        }
        if (this.transferOrderDataList[0].transfer_order_line.length > 0 &&
          this.transferOrderDataList[0].transfer_order_line[0].barcode != null
          && this.transferOrderDataList[0].transfer_order_line[0].barcode != undefined
          && this.transferOrderDataList[0].transfer_order_line[0].barcode != '') {
          this.dataSource = new MatTableDataSource<TransferOrderLineModel>(this.transferOrderDataList[0].transfer_order_line);
          this.dataSource.paginator = this.mypaginationpaginator;
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource = new MatTableDataSource<TransferOrderLineModel>([]);
          this.dataSource.paginator = this.mypaginationpaginator;
          this.dataSource.sort = this.sort;
        }
      } else {
        this.spinner.hide();
        this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
      }
    }).catch(e => {
      this._toster.error(e, 'Error');
      this.spinner.hide();
    }).finally(() => {
      this.spinner.hide();
    })

  }

  async downloadFileReport(data) {
    const blob = new Blob([data], {type: 'application/pdf'});
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = window.URL.createObjectURL(blob);
    document.body.appendChild(iframe);
    iframe.contentWindow.print();
    this.spinner.hide();
  }


  // GetReportFromServer() {
  //   this.spinner.show();
  //   this.webApiHttp.Get_Data_With_DownloadStatus_GetFile(this.webApiHttp.ApiURLArray.TransferOrderReport + this.transferOrderDataList[0].document_no + '&flag=TranferCreate')
  //     .subscribe(async (event: HttpEvent<any>) => {
  //       switch (event.type) {
  //         case HttpEventType.Sent:
  //           break;
  //         case HttpEventType.ResponseHeader:
  //           break;
  //         case HttpEventType.DownloadProgress:
  //           break;
  //         case HttpEventType.Response: {
  //           try {
  //             if (event.body.type == "application/pdf") {
  //               FileSaver.saveAs(event.body, 'report_' + this.transferOrderDataList[0].document_no + '.pdf');
  //               await this.downloadFile(event.body);
  //             } else if (event.body.type == "application/json") {
  //               const blb = new Blob([event.body], {type: "text/plain"});
  //               var jsonresult = JSON.parse(this.webApiHttp.blobToString(blb));
  //               if (jsonresult[0].condition.toUpperCase() == "FALSE") {
  //                 this._toster.error(jsonresult[0].message, "Error");
  //               }
  //             }
  //             this.spinner.hide();
  //           } catch (e) {
  //             this.spinner.hide();
  //           }
  //           break;
  //         }
  //       }
  //     }, error => {
  //       this.spinner.hide();
  //     });
  // }

  // async downloadFile(data) {
  //   const blob = new Blob([data], {type: 'application/pdf'});
  //   const iframe = document.createElement('iframe');
  //   iframe.style.display = 'none';
  //   iframe.src = window.URL.createObjectURL(blob);
  //   document.body.appendChild(iframe);
  //   iframe.contentWindow.print();
  //   //this.router.navigate(['/ordermanagement/transferlist']);
  // }

  discard_transfer_order() {

    var dialogConfig = this.dialog.open(pristineConfirmDialogComponent)
    dialogConfig.componentInstance.confirmMessage = 'You want to delete this document.';
    dialogConfig.afterClosed().subscribe(result => {
      if (result == true) {

        this.spinner.show();
        var json = {
          transfer_order_no: this.transferOrderDataList[0].document_no,
          email_id: this.sessionManageMent.getEmail
        }
        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.DiscardTransferOrderDocument, json).then(result => {
          if (result.length > 0 && result[0].condition.toLowerCase() === 'true') {
            this.transferOrderDataList = [];
            this._toster.success('Document Delete Successfully.', 'Error');
            this.router.navigate(['/ordermanagement/transferlist']);
          } else {
            this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
          }
        }).catch(e => {
          this._toster.error(e.message, 'Error');
        }).finally(() => {
          this.spinner.hide();
          this.ScanItemdata.nativeElement.focus();
        });

      }
    })

  }

  delete_line(element: TransferOrderLineModel) {

    var dialogConfig = this.dialog.open(pristineConfirmDialogComponent)
    dialogConfig.componentInstance.confirmMessage = 'You want to delete one qty of this item' + element.barcode + '.';
    dialogConfig.afterClosed().subscribe(result => {
      if (result == true) {

        this.spinner.show();
        var json = {
          transfer_order_no: this.transferOrderDataList[0].document_no,
          email_id: this.sessionManageMent.getEmail,
          barcode: element.barcode,
          Quantity: 1
        }
        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.deleteBarcodeSerialByUser, json).then(result => {
          if (result.length > 0 && result[0].condition.toLowerCase() === 'true') {
            this.transferOrderDataList = result;
            if (this.transferOrderDataList[0].order_status == 'Pending') {
              this.displayedColumns = ['barcode', 'item_name', 'ordered_quantity', 'transfer_cost', 'total_amount', 'gst_amount',
                'total_amount_with_gst', 'Action'];
            } else {
              this.displayedColumns = ['barcode', 'item_name', 'ordered_quantity', 'received_qty', 'shortage_qty', 'transfer_cost', 'total_amount', 'gst_amount',
                'total_amount_with_gst', 'Action'];
            }
            if (this.transferOrderDataList[0].transfer_order_line.length > 0 &&
              this.transferOrderDataList[0].transfer_order_line[0].barcode != null
              && this.transferOrderDataList[0].transfer_order_line[0].barcode != undefined
              && this.transferOrderDataList[0].transfer_order_line[0].barcode != '') {
              this.dataSource = new MatTableDataSource<TransferOrderLineModel>(this.transferOrderDataList[0].transfer_order_line);
              this.dataSource.paginator = this.mypaginationpaginator;
              this.dataSource.sort = this.sort;
            } else {
              this.dataSource = new MatTableDataSource<TransferOrderLineModel>([]);
              this.dataSource.paginator = this.mypaginationpaginator;
              this.dataSource.sort = this.sort;
            }
            this._toster.success('Barcode ' + element.barcode + ' Qty Delete Successfully.', 'Error');
          } else {
            this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
          }
        }).catch(e => {
          this._toster.error(e.message, 'Error');
        }).finally(() => {
          this.spinner.hide();
          this.ScanItemdata.nativeElement.focus();
        });

      }
    })

  }

  enableFindItem() {
    if (this.AddItem.get('ToLocation').value == this.sessionManageMent.getLocationId) {
      this._toster.warning('Select Different Location', 'Warning');
      this.ScanItemdata.nativeElement.value = '';
      this.ScanItemdata.nativeElement.disabled = true;
      return;
    } else {
      this.ScanItemdata.nativeElement.disabled = false;
    }
  }

  getTotalQuantity() {
    let sum = 0;
    for (let i = 0; i < this.dataSource.data.length; i++) {
      sum += this.dataSource.data[i].ordered_quantity;
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

  //todo genrate irn_number
  genrateIRNNumber() {
    if (this.transferOrderDataList == null || this.transferOrderDataList == undefined || this.transferOrderDataList.length <= 0) {
      this._toster.error('Data Not Bind on Ui. Please Refress UI');
      return;
    }
    if (this.transferOrderDataList[0].irn_genrated > 0) {
      this._toster.error('IRN Number Already Genrated.');
      return;
    }

    var dialogConfig = this.dialog.open(pristineConfirmDialogComponent)
    dialogConfig.componentInstance.confirmMessage = 'Do You Really Want To Genrate IRN Number.';
    dialogConfig.afterClosed().subscribe(result => {
      if (result == true) {
        var json = JSON.parse(this.transferOrderDataList[0].irn_json_data);

        json.Header.document_no = this.transferOrderDataList[0].document_no;
        json.Header.location_id = this.sessionManageMent.getLocationId;
        json.Header.created_by = this.sessionManageMent.getEmail;
        this.spinner.show();
        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.einvoice_generateIRN, json).then(result => {
          if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
            this._toster.success(result[0].message, 'Success');
            this.get_TransferOrderDetail(this.transferOrderDataList[0].document_no);

          } else {
            this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
          }
        }).catch(err => {
          this._toster.error(err.message, 'Error');
        }).finally(() => {
          this.spinner.hide();
        });
      }
    });

  }

  markCancelIRNNumber(cancel_reason: string, irn_cancelremark: string) {
    if (this.transferOrderDataList == null || this.transferOrderDataList == undefined || this.transferOrderDataList.length <= 0) {
      this._toster.error('Data Not Bind on Ui. Please Refress UI', 'Error');
      return;
    }
    if (cancel_reason == null || cancel_reason == undefined || cancel_reason == '') {
      this._toster.error('Please Enter Cancel Reason', 'Error');
      return;
    }
    if (irn_cancelremark == null || irn_cancelremark == undefined || irn_cancelremark == '') {
      this._toster.error('Please Enter Cancel Remark', 'Error');
      return;
    }
    if (this.transferOrderDataList[0].irn_genrated <= 0) {
      this._toster.error('IRN Number Already Canceled.', 'Error');
      return;
    }

    var dialogConfig = this.dialog.open(pristineConfirmDialogComponent)
    dialogConfig.componentInstance.confirmMessage = 'Do You Really Want To Cancel IRN Number.';
    dialogConfig.afterClosed().subscribe(result => {
      if (result == true) {
        var json = JSON.parse(this.transferOrderDataList[0].irn_json_data);

        json.Header.document_no = this.transferOrderDataList[0].document_no;
        json.Header.location_id = this.sessionManageMent.getLocationId;
        json.Header.created_by = this.sessionManageMent.getEmail;
        json.CancelRequest = {
          Irn: this.transferOrderDataList[0].irn_hash,
          CnlRsn: cancel_reason,
          CnlRem: irn_cancelremark
        };
        this.spinner.show();
        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.einvoice_CancelIRN, json).then(result => {
          if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {

            this._toster.success(result[0].message, 'Success');
            this.get_TransferOrderDetail(this.transferOrderDataList[0].document_no);

          } else {
            this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
          }
        }).catch(err => {
          this._toster.error(err.message, 'Error');
        }).finally(() => {
          this.spinner.hide();
        });
      }
    });


  }

  //todo genrate irn_number
  genrateEWayBillNumber() {
    if (this.transferOrderDataList == null || this.transferOrderDataList == undefined || this.transferOrderDataList.length <= 0) {
      this._toster.error('Data Not Bind on Ui. Please Refress UI');
      return;
    }
    if (this.transferOrderDataList[0].irn_genrated < 0) {
      this._toster.error('First IRN Number Genrate.');
      return;
    }
    if (this.transferOrderDataList[0].irn_canceled > 0) {
      this._toster.error('IRN Number Is  Canceled.');
      return;
    }
    if (this.transferOrderDataList[0].eway_bill_genrated > 0) {
      this._toster.error('E-way Bill Already Genrated.');
      return;
    }

    if (!(new RegExp('[0-9]{2}[0-9A-Z]{13}').test(this.Transin))) {
      this._toster.error('Transin/GSTIN Have This Format.');
      return;
    }

    var dialogConfig = this.dialog.open(pristineConfirmDialogComponent)
    dialogConfig.componentInstance.confirmMessage = 'Do You Really Want To Genrate W-Way Bill.';
    dialogConfig.afterClosed().subscribe(result => {
      if (result == true) {
        var json = JSON.parse(this.transferOrderDataList[0].irn_json_data);
        json.Header.document_no = this.transferOrderDataList[0].document_no;
        json.Header.location_id = this.sessionManageMent.getLocationId;
        json.Header.created_by = this.sessionManageMent.getEmail;
        var ewayBiljson: any;
        if (this.TransMode == "1") {
          if (!(new RegExp('[0-9]{2}[0-9A-Z]{13}').test(this.Transin))) {
            this._toster.error('Transin/GSTIN Have This Format.');
            return;
          }
          if (this.VehNo.length < 4 || !(new RegExp('[A-Z|a-z|0-9]{4,20}').test(this.VehNo))) {
            this._toster.error('The field Vehicle Number must be a string with a minimum length of 4 and a maximum length of 20.');
            return;
          }

          ewayBiljson = {
            Header: json.Header,
            GenerateEWayBillJson: {
              Irn: this.transferOrderDataList[0].irn_hash,
              TransMode: this.TransMode,
              TransId: this.Transin,
              TransName: this.name_of_transpoter,
              TransDocDt: this.datepipe.transform(this.TransDocDt, 'dd/MM/yyyy'),
              TransDocNo: this.TransDocNo,
              VehNo: this.VehNo,
              VehType: this.VehType
            }
          };
        } else {
          ewayBiljson = {
            Header: json.Header,
            GenerateEWayBillJson: {
              Irn: this.transferOrderDataList[0].irn_hash,
              TransMode: this.TransMode,
              TransId: this.Transin,
              TransName: this.name_of_transpoter,
              TransDocDt: this.datepipe.transform(this.TransDocDt, 'dd/MM/yyyy'),
              TransDocNo: this.TransDocNo
            }
          };
        }

        this.spinner.show();
        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.einvoice_generateEWayBill, ewayBiljson).then(result => {
          if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
            this._toster.success(result[0].message, 'Success');
            this.get_TransferOrderDetail(this.transferOrderDataList[0].document_no);

          } else {
            this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
          }
        }).catch(err => {
          this._toster.error(err.message, 'Error');
        }).finally(() => {
          this.spinner.hide();
        });
      }
    });

  }

  markCancelEwayNumber() {
    if (this.transferOrderDataList == null || this.transferOrderDataList == undefined || this.transferOrderDataList.length <= 0) {
      this._toster.error('Data Not Bind on Ui. Please Refress UI', 'Error');
      return;
    }
    if (this.e_way_cancel_reason == null || this.e_way_cancel_reason == undefined || this.e_way_cancel_reason == '') {
      this._toster.error('Please Enter Cancel Remark', 'Error');
      return;
    }

    var dialogConfig = this.dialog.open(pristineConfirmDialogComponent)
    dialogConfig.componentInstance.confirmMessage = 'Do You Really Want To Cancel W-Way Bill.';
    dialogConfig.afterClosed().subscribe(result => {
      if (result == true) {
        var json = JSON.parse(this.transferOrderDataList[0].irn_json_data);

        console.log(json, this.transferOrderDataList[0])
        json.Header.document_no = this.transferOrderDataList[0].document_no;
        json.Header.location_id = this.sessionManageMent.getLocationId;
        json.Header.created_by = this.sessionManageMent.getEmail;
        json.CancelEWayBillJson = {
          ewbNo: this.transferOrderDataList[0].EwbNo,
          cancelRsnCode: this.e_way_cancel_reason,
          cancelRmrk: this.e_way_cancelremarktemp
        };
        this.spinner.show();
        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.einvoice_CancelEWayBill, json).then(result => {
          if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {

            this._toster.success(result[0].message, 'Success');
            this.get_TransferOrderDetail(this.transferOrderDataList[0].document_no);

          } else {
            this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
          }
        }).catch(err => {
          this._toster.error(err.message, 'Error');
        }).finally(() => {
          this.spinner.hide();
        });
      }
    });

  }

  open_report_panel(document_no: string) {
    this.spinner.show();
    this.webApiHttp.Get_Data_With_DownloadStatus_GetFile(this.webApiHttp.ApiURLArray.einvoice_GetEinvoiceReport + document_no)
      .subscribe(async (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            break;
          case HttpEventType.ResponseHeader:
            break;
          case HttpEventType.DownloadProgress:
            break;
          case HttpEventType.Response: {
            try {
              if (event.body.type == "application/pdf") {
                FileSaver.saveAs(event.body, 'report_' + this.transferOrderDataList[0].document_no + '.pdf');
                await this.downloadFileReport(event.body);
              } else if (event.body.type == "application/json") {
                const blb = new Blob([event.body], {type: "text/plain"});
                var jsonresult = JSON.parse(this.webApiHttp.blobToString(blb));
                if (jsonresult[0].condition.toUpperCase() == "FALSE") {
                  this._toster.error(jsonresult[0].message, "Error");
                }
                this.spinner.hide();
              }
            } catch (e) {
              this.spinner.hide();
            }
            break;
          }
        }
      }, error => {
        this.spinner.hide();
        if (error.status == 401) {
          this._signalR.stopSignalRConnection();
          localStorage.clear();
        }
      });
  }

  total_sortage_qty(): number {
    let sum: number = 0;
    this.dataSource.data.forEach(item => {
      sum += (item.received_qty_forcefully)
    })
    return sum;
  }

  download_transfer_order() {
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.HSNWiseReport + this.inputjson.doc_no).then(
        result => {
          if (result.length > 0) {
            this.excelService.downloadFileInCsv(result, '');
          } else {
            this._toster.warning(result[0].message, 'Message');
          }
          this.spinner.hide();
          return;
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

  private _filter_transpoter() {
    const filterValue = this.temp_name_of_transpoter;
    this.filter_transpoter_list = this.transpoter_list.filter(item => (item.name.toLowerCase().includes(filterValue.toLowerCase()) || item.code.toLowerCase().includes(filterValue.toLowerCase())));
  }
}


export class TransferOrderModel {
  completed_on: string;
  fromLocation: Array<Location_mstModel>;
  toLocation: Array<Location_mstModel>;
  condition: string;
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
  total_quantity: string;
  total_quantity_received: string;
  total_quantity_shipped: string;
  total_transfer_cost: number;
  total_transfer_cost_with_gst: number;
  creation_type: string;

  //todo einvoice IRN Genrated work
  irn_genrated: number;
  irn_json_data: string;
  acknowledgement_no: string;
  irn_genrated_by: string;
  acknowledgement_date: string;
  irn_hash: string;
  qr_code: string;

  //todo einvoice IRN Cancel  work
  irn_cancelled_date: string;
  irn_canceled: number;
  irn_cancel_reason: string;
  irn_cancel_remark: string;

//todo EWAY Bill
  eway_bill_genrated: number;
  EwbNo: string;
  EwbDt: string;
  EwbValidTill: string;
  eway_genrated_by: string;
  eway_genarted_on: string;

  //todo EWAY Cancel Bill

  eway_canceled: number;
  eway_cancelRsnCode: string;
  eway_cancelRmrk: string;

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
  received_qty_forcefully: number;
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
