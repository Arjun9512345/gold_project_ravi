import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {SessionManageMent} from '../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../@pristine/process/WebApiHttp.services';
import {ToastrService} from 'ngx-toastr';
import {EncriptDecript} from '../../../../@pristine/process/EncriptDecript';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {DatePipe} from '@angular/common';
import {ExcelService} from '../../../../@pristine/process/excel.Service';
import {MatPaginator} from "@angular/material/paginator";
import {StoreMasterListModel} from "../../pos_master/pos_store/pos_store.component";

@Component({
  selector: 'app-credit-note-report',
  templateUrl: './credit-note-report.component.html',
  styleUrls: ['./credit-note-report.component.scss']
})
export class CreditNoteReportComponent implements OnInit {

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  creditNoteFormGroup: FormGroup;
  today: any = new Date();
  length = 0;
  RowsPerPage = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  PageNumber = 0;
  creditNoteData:Array<any> = [];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns: string[] = ['credit_no','return_no','sale_header_no','credit_payment','credit_applied','last_credit_applied_on'];
  loadding: boolean= false;
  excelTable: Array<any>=[];
  constructor(private _webApiHttp: WebApiHttp,
              private _toaster: ToastrService,
              private _spinner: NgxSpinnerService,
              private _datePipe: DatePipe,
              private _fb: FormBuilder,
              private  excelService: ExcelService) { }

  ngOnInit(): void {
    this.creditNoteFormGroup = this._fb.group({
      start_date:[this.today, Validators.required],
      end_date:[this.today, Validators.required],
      doc_no:[''],
    });
  }
  applyFilter(filterValue: string, keyName: string) {
      this.dataSource.filter = filterValue;
      this.dataSource.filterPredicate = function(data, filter: string): boolean {
        if (data[keyName] != undefined && data[keyName] != null && data[keyName] != '') {
          return (data[keyName] != null && data[keyName] != undefined ? data[keyName].toString().toLowerCase() : '').includes(filter.toLowerCase());
        } else {
          return false;
        }
      };
  }

  myPagginaterEvent(event) {
    this.RowsPerPage = event.pageSize;
    this.PageNumber = event.pageIndex;
    this.applyFilter('', '');
  }
  getReport() {
    this._spinner.show();
    try{
      this.loadding = true;
      let json = {
        from_date : this._datePipe.transform(this.creditNoteFormGroup.get('start_date').value, 'yyyy-MM-dd') ,
        to_date : this._datePipe.transform(this.creditNoteFormGroup.get('end_date').value, 'yyyy-MM-dd') ,
        doc_no:  this.creditNoteFormGroup.get('doc_no').value?this.creditNoteFormGroup.get('doc_no').value:'',
      }
      this.creditNoteData =[]
      this.dataSource = new MatTableDataSource<any>([]);
      this._webApiHttp.Post(this._webApiHttp.ApiURLArray.credit_note_report, json).then(res=> {
        this.loadding=false;
        if(res[0]?.condition?.toLowerCase()=='true'){
          this.dataSource = new MatTableDataSource<any>(res);
          this.excelTable = Object.assign([], res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }else {
          this._toaster.show(res[0]?.message)
        }
        this._spinner.hide();
      }).catch(err=>{this._spinner.hide();
      });
    }catch(e){}
  }

  reset() {
    this.creditNoteFormGroup.reset();

    this.creditNoteFormGroup.get('start_date').setValue('');
    this.creditNoteFormGroup.get('end_date').setValue('');
    this.creditNoteFormGroup.get('doc_no').setValue('');
  }

  downloadExcel() {

    for (let i = 0; i < this.dataSource?.data?.length; i++) {
      delete this.dataSource[i]?.condition
    }
    this.excelService.MultisheetWorkbook([this.dataSource],['Credit Note'],'Credit Note Details')
  }

}
