import {Component, OnInit, ViewChild} from '@angular/core';
import {SessionManageMent} from '../../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../../@pristine/process/WebApiHttp.services';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {EncriptDecript} from '../../../../../@pristine/process/EncriptDecript';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {pristineConfirmDialogComponent} from "../../../../../@pristine/components/confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {isNumeric} from "rxjs/internal-compatibility";
import * as XLSX from "xlsx";
import {ExcelUploadModel} from "../../../ordermanagement/transfer/transfercreate/transfercreate.component";
import {ExcelService} from "../../../../../@pristine/process/excel.Service";



@Component({
  selector: 'app-adjusmentcreate',
  templateUrl: './adjusmentcreate.component.html',
  styleUrls: ['./adjusmentcreate.component.scss']
})
export class AdjusmentcreateComponent implements OnInit {

  inputjson: any;

  AdjustmentType = new FormControl('', Validators.required);
  arrayBuffer: any;
  upload_excel_file: Array<ExcelUploadModel> = [];



  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['item_code', 'barcode', 'quantity', 'scanned_on'];
  adjustment_work: FormGroup;

  constructor(public sessionManageMent: SessionManageMent,
              private webApiHttp: WebApiHttp,
              private _formBuilder: FormBuilder,
              private _toster: ToastrService,
              private _encriptDecript: EncriptDecript,
              private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog,
              private spinner: NgxSpinnerService,
              private excelService: ExcelService) {

    this.adjustment_work = _formBuilder.group({
      Barcode: ['', Validators.required],
      Quantity: [1, Validators.required]
    });

    this.inputjson = JSON.parse(this._encriptDecript.decrypt(this.route.snapshot.paramMap.get('res')));

  }

  ngOnInit(): void {
    console.log(this.inputjson);
    if (this.inputjson.action != 'Create')
      this.document_info();
    if (this.inputjson.action != 'view')
      this.displayedColumns.push('delete');
    if (this.inputjson.action == 'approve')
      this.displayedColumns.splice(3, 0, 'approved_quantity');
  }

  document_info() {
    try {
      this.spinner.show();
      const json = {
        DocumentNo: this.inputjson.DocumentNo
      };

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.DocumentView, json).then(
        result => {
          if (result[0].condition == 'True') {
            this.dataSource = new MatTableDataSource<any>(result);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          } else {
            this._toster.info(result[0].message, 'Info');
          }
          this.spinner.hide();
        }).catch(error => {
        this.spinner.hide();
        this._toster.error(error, 'Exception');
      });
    } catch (e) {
      this.spinner.hide();
      this._toster.error(e, 'Exception');
    }
  }

  complete_adjustment() {
    var dialogConfig = this.dialog.open(pristineConfirmDialogComponent)
    dialogConfig.componentInstance.confirmMessage = 'Are you sure you want complete?';
    dialogConfig.afterClosed().subscribe(result => {
      if (result == true) {
        this.spinner.show();
        const json = {
          DocumentNo: this.dataSource.data[0].adjustment_no
        };

        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.AdjustmentComplete, json).then(
          result => {
            if (result[0].condition == 'True') {
              this._toster.success(result[0].message, 'Success');
              this.router.navigate(['/internal/itemadjusment']);
            } else {
              this._toster.error(result[0].message, 'Error');
            }
            this.spinner.hide();
          }).catch(error => {
          this.spinner.hide();
          this._toster.error(error, 'Exception');
        });
      }
    })
  }

  applyFilter(filterValue: string, keyName: string) {
    this.dataSource.filter = filterValue;
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      if (data[keyName] != undefined && data[keyName] != null && data[keyName] != '') {
        return (data[keyName] != null && data[keyName] != undefined ? data[keyName].toString().toLowerCase() : '').includes(filter.toLowerCase());
      } else {
        return false;
      }
    };
  }

  line_without_scan() {
    try {
      this.spinner.show();
      const json = {
        Quantity: this.adjustment_work.get('Quantity').value,
        Barcode: this.adjustment_work.get('Barcode').value,
        DocumentNo: this.dataSource.data[0].adjustment_no
      };

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.AdjustmentWithoutScan, json).then(
        result => {
          if (result[0].condition == 'True') {
            this.dataSource = new MatTableDataSource<any>(result);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          } else {
            this._toster.info(result[0].message, 'Info');
          }
          this.adjustment_work.get('Quantity').setValue(1);
          this.adjustment_work.get('Barcode').setValue('');

          this.spinner.hide();
        }).catch(error => {
        this.spinner.hide();
        this._toster.error(error, 'Exception');
      });
    } catch (e) {
      this.spinner.hide();
      this._toster.error(e, 'Exception');
    }
  }

  start_adjustment() {
    try {
      this.spinner.show();
      const json = {
        Type: this.AdjustmentType.value,
        EmailId: this.sessionManageMent.getEmail,
        LocationId: this.sessionManageMent.getLocationId
      };

      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.DocumentCreate, json).then(
        result => {
          if (result[0].condition == 'True') {
            this.dataSource = new MatTableDataSource<any>(result);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.router.navigate(['/internal/adjuestmentwork',
              {res: this._encriptDecript.encrypt('{"action": "update","DocumentNo":"' + result[0].adjustment_no + '"}')}])
          } else {
            this._toster.error(result[0].message, 'Error');
          }
          this.spinner.hide();
        }).catch(error => {
        this.spinner.hide();
        this._toster.error(error, 'Exception');
      });
    } catch (e) {
      this.spinner.hide();
      this._toster.error(e, 'Exception');
    }
  }

  delete_line(element) {
    var dialogConfig = this.dialog.open(pristineConfirmDialogComponent)
    dialogConfig.componentInstance.confirmMessage = 'Are you sure you want to delete line?';
    dialogConfig.afterClosed().subscribe(result => {
      if (result == true) {
        this.spinner.show();
        const json = {
          DocumentLineNo: element.adjustment_line_no,
          DocumentNo: element.adjustment_no
        };

        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.DeleteLine, json).then(
          result => {
            if (result[0].condition == 'True') {
              this.dataSource = new MatTableDataSource<any>(result);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            } else {
              this._toster.info(result[0].message, 'Info');
            }
            this.spinner.hide();
          }).catch(error => {
          this.spinner.hide();
          this._toster.error(error, 'Exception');
        });
      }
    })
  }

  check_number(element: any) {

    if (isNumeric(element.approved_quantity) && element.approved_quantity > 0 && element.approved_quantity <= element.quantity) {
      return true;
    } else {
      if (element.approved_quantity > element.quantity) {
        this._toster.warning('Approved quantity can not be more the scanned quantity', 'Warning');
      } else {
        this._toster.warning('Only Numeric and non zero values are accepted', 'Warning');
      }
      this.dataSource.data[this.dataSource.data.indexOf(element)].new_quantity = 0;
      this.dataSource.data = [...this.dataSource.data];
      return false;
    }
  }

  approval_submit(action:string){
    var dialogConfig = this.dialog.open(pristineConfirmDialogComponent)
    dialogConfig.componentInstance.confirmMessage = 'Are you sure document will get '+ action + ' ?';
    dialogConfig.afterClosed().subscribe(result => {
      if (result == true) {
        this.spinner.show();
        const json = {
          Lines: this.dataSource.data,
          DocumentNo: this.dataSource.data[0].adjustment_no,
          EmailId: this.sessionManageMent.getEmail,
          Action: action
        };
        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.ApprovalComplete, json).then(
          result => {
            if (result[0].condition == 'True') {
              this._toster.success(result[0].message, 'Success');
              this.router.navigate(['/internal/itemadjusmentApproval']);
            } else {
              this._toster.info(result[0].message, 'Info');
            }
            this.spinner.hide();
          }).catch(error => {
          this.spinner.hide();
          this._toster.error(error, 'Exception');
        });
      }
    })
  }

  downloadSampleDoc() {
    const json = [{
      barcode: null,
      quantity: null
    }]
    this.excelService.exportAsExcelFile(json, "upload_sample");
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
            var uploaded_data: Array<ExcelUploadModel> = XLSX.utils.sheet_to_json(worksheet, {raw: true});
            if (uploaded_data.length <= 0) {
              this.upload_excel_file = [];
              this.spinner.hide();
              this._toster.error('Error', 'Excel File Is Empty.');
            } else {
              this.upload_excel_file = uploaded_data;
              this.spinner.hide();
              this.linecreatebyupload(uploaded_data);
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

  linecreatebyupload(upload_excel_file: any){
    var dialogConfig = this.dialog.open(pristineConfirmDialogComponent)
    dialogConfig.componentInstance.confirmMessage = 'Are you sure you want to upload excel?';
    dialogConfig.afterClosed().subscribe(result => {
      if (result == true) {
        this.spinner.show();
        const json = {
          LinesUpload: upload_excel_file,
          DocumentNo: this.dataSource.data[0].adjustment_no,
          EmailId: this.sessionManageMent.getEmail
        };
        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.AdjustmentWithUpload, json).then(
          result => {
            if (result[0].condition == 'True') {
              this.dataSource = new MatTableDataSource<any>(result);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            } else {
              this._toster.info(result[0].message, 'Info');
            }
            this.adjustment_work.get('Quantity').setValue(1);
            this.adjustment_work.get('Barcode').setValue('');

            this.spinner.hide();
          }).catch(error => {
          this.spinner.hide();
          this._toster.error(error, 'Exception');
        });
      }
    })
  }

}
