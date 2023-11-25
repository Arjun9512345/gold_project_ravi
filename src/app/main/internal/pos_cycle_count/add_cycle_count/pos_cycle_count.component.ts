import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder, FormControl} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {WebApiHttp} from '../../../../../@pristine/process/WebApiHttp.services';
import {SessionManageMent} from '../../../../../@pristine/process/SessionManageMent';
import {NgxSpinnerService} from "ngx-spinner";
import {ExcelService} from "../../../../../@pristine/process/excel.Service";
import {pristineConfirmDialogComponent} from "../../../../../@pristine/components/confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute} from "@angular/router";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";

@Component({
  selector: 'app-pos_cycle_count',
  templateUrl: './pos_cycle_count.component.html',
  styleUrls: ['./pos_cycle_count.component.scss']
})
export class Pos_cycle_countComponent implements OnInit {
  document_type = new FormControl('');
  displayedColumns: string[] = ['barcode', 'item_no', 'scan_qty','approve_qty', 'delete'];
  viewBrandDataSource: MatTableDataSource<PosCycleCountLine> = new MatTableDataSource<PosCycleCountLine>();

  @ViewChild('ScanItemdata', {static: true}) ScanItemdata: ElementRef;

  constructor(public sessionManageMent: SessionManageMent,
              public webApiHttp: WebApiHttp,
              private _formBuilder: FormBuilder,
              private ngxSpinnerService: NgxSpinnerService,
              private _toster: ToastrService,
              private activatedRoute:ActivatedRoute,
              private _encriptDecript: EncriptDecript,
              private dialog: MatDialog,
              public excelService: ExcelService) {

  }


  ngOnInit(): void {
    let document_no =this._encriptDecript.decrypt(this.activatedRoute.snapshot.paramMap.get('res'));
    this.getCycleCountHeader('',document_no);
    setTimeout(function () {
      document.getElementById('sacnItemBarcode').focus();
    }, 100);
  }

  hitToDeleteDocumentData() {
    var dialogConfig = this.dialog.open(pristineConfirmDialogComponent)
    dialogConfig.componentInstance.confirmMessage = 'Do you really want to delete this document?';
    dialogConfig.afterClosed().subscribe(result => {
      if (result == true) {
        this.ngxSpinnerService.show();
        var json = {
          cycle_count_code: this.cycle_count_data_list[0]?.header.document_no,
        };
        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.DeleteCycleCountDocument, json).then((result) => {
          if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
            this.cycle_count_data_list=[];
            this.getCycleCountHeader('','');
          } else {
            this._toster.error(result.length > 0 ? result[0]?.message : result.message, 'Error');
          }
        }).catch(error => {
          this._toster.error(error, 'Error');
        }).finally(() => {
          this.ngxSpinnerService.hide();
          this.ScanItemdata.nativeElement.value = ''
          this.ScanItemdata.nativeElement.focus();
        });
      }});
  }
  hitToCompleteData() {
    var dialogConfig = this.dialog.open(pristineConfirmDialogComponent)
    dialogConfig.componentInstance.confirmMessage = 'Do you really want to complete this?';
    dialogConfig.afterClosed().subscribe(result => {
      if (result == true) {
        this.ngxSpinnerService.show();
        var json = {
          cycle_count_code: this.cycle_count_data_list[0]?.header.document_no,
          store_id: this.sessionManageMent.getLocationId
        };
        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.CompleteCycleCountItem, json).then((result) => {
          if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
            var response: Array<PosCycleCountModel> = result;
            if (response.length > 0 && response[0].header.condition.toLowerCase() == 'true') {
              this.cycle_count_data_list = response;
              this.cycle_count_data_list = [];
              this.viewBrandDataSource = new MatTableDataSource<PosCycleCountLine>([]);
              this.length = 0;
            } else {
              this._toster.error(response[0].header.message, 'Error');
            }
          } else {
            this._toster.error(result.length > 0 ? result[0]?.message : result.message, 'Error');
          }
        }).catch(error => {
          this._toster.error(error, 'Error');
        }).finally(() => {
          this.ngxSpinnerService.hide();
          this.ScanItemdata.nativeElement.value = ''
          this.ScanItemdata.nativeElement.focus();
        });
      }});
  }

  applyFilter(filterValue: string, keyName: string) {
    this.getCycleCountHeader(filterValue);
  }

  cycle_count_data_list: Array<PosCycleCountModel> = [];
  length = 0;
  RowsPerPage = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  PageNumber = 0;

  myPagginaterEvent(event) {
    this.RowsPerPage = event.pageSize;
    this.PageNumber = event.pageIndex;
    this.applyFilter('', '');
  }

  getCycleCountHeader(filter_value: string,document_no:string='') {
    this.ngxSpinnerService.show();
    var json = {
      document_type: this.cycle_count_data_list?.length > 0 ? this.cycle_count_data_list[0]?.header.document_type : '',
      document_no: this.cycle_count_data_list?.length > 0 ? this.cycle_count_data_list[0]?.header.document_no : document_no,
      location_id: this.sessionManageMent.getLocationId,
      line_barcode_filter: filter_value,
      RowsPerPage: this.RowsPerPage,
      PageNumber: this.PageNumber,
      email_id: this.sessionManageMent.getEmail
    };
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.GetCycleCountHeader, json).then((result) => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        var response: Array<PosCycleCountModel> = result;
        if (response.length > 0 && response[0].header.condition.toLowerCase() == 'true') {
          this.cycle_count_data_list = response;
          if (this.cycle_count_data_list[0].lines.length > 0 &&
            (this.cycle_count_data_list[0].lines[0]?.barcode != null && this.cycle_count_data_list[0].lines[0]?.barcode != undefined
              && this.cycle_count_data_list[0].lines[0]?.barcode != '')) {
            this.viewBrandDataSource = new MatTableDataSource<PosCycleCountLine>(response[0].lines);
            this.length = this.cycle_count_data_list[0].lines[0].total_rows;
          } else {
            this.viewBrandDataSource = new MatTableDataSource<PosCycleCountLine>([]);
            this.length = 0;
          }
        } else {
          this._toster.error(response[0].header.message, 'Error');
        }
      } else {
        this._toster.error(result.length > 0 ? result[0]?.message : result.message, 'Error');
      }
    }).catch(error => {
      this._toster.error(error.message, 'Error');
    }).finally(() => {
      this.ngxSpinnerService.hide();
    });
  }

  CreateCycleCountHeader() {
    this.ngxSpinnerService.show();
    var json = {
      document_type: this.document_type.value,
      document_no:  '',
      location_id: this.sessionManageMent.getLocationId,
      line_barcode_filter:'',
      RowsPerPage: this.RowsPerPage,
      PageNumber: this.PageNumber,
      email_id: this.sessionManageMent.getEmail
    };
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.GetCycleCountHeader, json).then((result) => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        var response: Array<PosCycleCountModel> = result;
        if (response.length > 0 && response[0].header.condition.toLowerCase() == 'true') {
          this.cycle_count_data_list = response;
          if (this.cycle_count_data_list[0].lines.length > 0 &&
            (this.cycle_count_data_list[0].lines[0]?.barcode != null && this.cycle_count_data_list[0].lines[0]?.barcode != undefined
              && this.cycle_count_data_list[0].lines[0]?.barcode != '')) {
            this.viewBrandDataSource = new MatTableDataSource<PosCycleCountLine>(response[0].lines);
            this.length = this.cycle_count_data_list[0].lines[0].total_rows;
          } else {
            this.viewBrandDataSource = new MatTableDataSource<PosCycleCountLine>([]);
            this.length = 0;
          }
        } else {
          this._toster.error(response[0].header.message, 'Error');
        }
      } else {
        this._toster.error(result.length > 0 ? result[0]?.message : result.message, 'Error');
      }
    }).catch(error => {
      this._toster.error(error.message, 'Error');
    }).finally(() => {
      this.ngxSpinnerService.hide();
    });
  }


  ScanItemNoByUser() {
    this.ngxSpinnerService.show();
    this.ScanItemdata.nativeElement.disabled = true;
    var json = {
      cycle_count_code: this.cycle_count_data_list[0]?.header?.document_no,
      barcode: this.ScanItemdata.nativeElement.value,
      location_id: this.sessionManageMent.getLocationId,
      RowsPerPage: this.RowsPerPage,
      PageNumber: this.PageNumber,
      line_barcode_filter: ''
    };
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.ScanCycleCountItem, json).then((result) => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        var response: Array<PosCycleCountModel> = result;
        if (response.length > 0 && response[0].header.condition.toLowerCase() == 'true') {
          this.cycle_count_data_list = response;
          if (this.cycle_count_data_list[0].lines.length > 0 &&
            (this.cycle_count_data_list[0].lines[0]?.barcode != null && this.cycle_count_data_list[0].lines[0]?.barcode != undefined
              && this.cycle_count_data_list[0].lines[0]?.barcode != '')) {
            this.viewBrandDataSource = new MatTableDataSource<PosCycleCountLine>(response[0].lines);
            this.length = this.cycle_count_data_list[0].lines[0].total_rows;
          } else {
            this.viewBrandDataSource = new MatTableDataSource<PosCycleCountLine>([]);
            this.length = 0;
          }
        } else {
          this._toster.error(response[0].header.message, 'Error');
        }
      } else {
        this._toster.error(result.length > 0 ? result[0]?.message : result.message, 'Error');
      }
    }).catch(error => {
      this._toster.error(error, 'Error');
    }).finally(() => {
      this.ngxSpinnerService.hide();
      this.ScanItemdata.nativeElement.value = ''
      this.ScanItemdata.nativeElement.disabled = false;
      this.ScanItemdata.nativeElement.focus();
    });
  }

  DownloadScanData() {
    if (this.viewBrandDataSource.data.length > 0) {
      this.excelService.exportAsExcelFile(this.viewBrandDataSource.data, 'DownloadScanData_'
        //+this.viewBrandDataSource.data[0].code
      );
    } else {
      this._toster.info("Please scan at least one item ", 'Info');
    }
  }

  DeleteItemNoByUser(element: any) {
    var dialogConfig = this.dialog.open(pristineConfirmDialogComponent)
    dialogConfig.componentInstance.confirmMessage = 'You want to delete one qty of this item ' + element.barcode + '?';
    dialogConfig.afterClosed().subscribe(result => {
      if (result == true) {

        this.ngxSpinnerService.show();
        this.ScanItemdata.nativeElement.disabled = true;
        var json = {
          cycle_count_code: element.document_no,
          barcode: element.barcode,
          location_id: this.sessionManageMent.getLocationId,
          RowsPerPage: this.RowsPerPage,
          PageNumber: this.PageNumber,
          line_barcode_filter: ''
        };
        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.DeleteCycleCountItem, json).then((result) => {
          if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
            var response: Array<PosCycleCountModel> = result;
            if (response.length > 0 && response[0].header.condition.toLowerCase() == 'true') {
              this.cycle_count_data_list = response;
              if (this.cycle_count_data_list[0].lines.length > 0 &&
                (this.cycle_count_data_list[0].lines[0]?.barcode != null && this.cycle_count_data_list[0].lines[0]?.barcode != undefined
                  && this.cycle_count_data_list[0].lines[0]?.barcode != '')) {
                this.viewBrandDataSource = new MatTableDataSource<PosCycleCountLine>(response[0].lines);
                this.length = this.cycle_count_data_list[0].lines[0].total_rows;
              } else {
                this.viewBrandDataSource = new MatTableDataSource<PosCycleCountLine>([]);
                this.length = 0;
              }
            } else {
              this._toster.error(response[0].header.message, 'Error');
            }
          } else {
            this._toster.error(result.length > 0 ? result[0]?.message : result.message, 'Error');
          }
        }).catch(error => {
          this._toster.error(error, 'Error');
        }).finally(() => {
          this.ngxSpinnerService.hide();
          this.ScanItemdata.nativeElement.value = ''
          this.ScanItemdata.nativeElement.disabled = false;
          this.ScanItemdata.nativeElement.focus();
        });


      }
    });
  }


}

export class PosCycleCountModel {
  condition: string;
  header: {
    condition: string;
    message: string;
    document_type: string;
    document_no: string;
    location_id: string;
    created_on: string;
    created_by: string;
    status: string;
    completed_on: string;
    is_approved: string;
    approval_id: string;
    approve_on: string;
    total_items: number;
    total_qty: number;
  };
  lines: Array<PosCycleCountLine>;
}

export class PosCycleCountLine {
  total_rows: number;
  document_no: string;
  line_no: string;
  item_no: string;
  barcode: string;
  scan_qty: string;
  approve_qty: string;
  update_on: string;
  reserved_qty_so: string;
  reserved_qty_transfer: string;
  total_reserved: string;
  total_qty_available_inventory: string;
  total_qty_inventory: string;
  adjustment_type: string;
  diffrence_actual_qty: string;
}



