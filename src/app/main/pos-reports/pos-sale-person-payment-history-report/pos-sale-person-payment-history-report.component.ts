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

@Component({
  selector: 'app-pos-sale-person-payment-history-report',
  templateUrl: './pos-sale-person-payment-history-report.component.html',
  styleUrls: ['./pos-sale-person-payment-history-report.component.scss']
})
export class PosSalePersonPaymentHistoryReportComponent implements OnInit {

  today = new Date();
  Year: Array<number> = [this.today.getFullYear()-2,this.today.getFullYear()-1,this.today.getFullYear()];
  months= ["January","February","March","April","May","June","July","August","September","October","November","December"];
  salepersonForm: FormGroup;
  total_amount:any=0;
  showTable:boolean=false;
  showExcel=false;
  sale_category:Array<any>=[];
  salePersonMasterListModels: Array<any> = [];
  displayedColumns: string[] = ['code','sale_commission','paid_from_date','paid_to_date','payment_by'];
  dataSource: MatTableDataSource<any>=new MatTableDataSource<any>();
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('content', {static: false}) divcontent: ElementRef;

  constructor(public sessionManageMent: SessionManageMent,
              private webApiHttp: WebApiHttp,
              private _formBuilder: FormBuilder,
              private _toster: ToastrService,
              private _encriptDecript: EncriptDecript,
              private router: Router,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService,
              private datePipe:DatePipe,
              private  excelService:  ExcelService,) {
    this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_sale_person_detail+sessionManageMent.getLocationId).then(result => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        this.salePersonMasterListModels = result;
      }
    });

    this.salepersonForm = _formBuilder.group({
      code: [''],
      month: [''],
      year: [''],
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


  length = 0;
  RowsPerPage = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  PageNumber = 0;

  myPagginaterEvent(event) {
    this.RowsPerPage = event.pageSize;
    this.PageNumber = event.pageIndex;
    this.applyFilter('', '');
  }
  ngOnInit(): void {
    // this.getSalePersonReport();
  }
  getSalePersonReport(){
    this.dataSource.data=[];
    this.showExcel = false;
    const json={
      code: this.salepersonForm.get('code').value,
      month: this.salepersonForm.get('month').value,
      year: this.salepersonForm.get('year').value,
    }
    console.log(json);
    this.spinner.show();

    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.get_sale_person_payment_report,json).then(result => {
      if(result[0].condition.toLowerCase()=='true'){
        this.dataSource = new MatTableDataSource<any>(result);
        this.dataSource.sort = this.sort;
        this.showExcel = true;
        this.spinner.hide();
      }
      else{
        this.spinner.hide();
        this._toster.info(result[0]?.message,'Info');
      }

    }, error => {
      this.spinner.hide();
    });
  }

  downloadExcel() {
    for (let i = 0; i < this.dataSource.data.length; i++) {
      delete this.dataSource.data[i].condition
    }
    this.excelService.exportAsExcelFile(this.dataSource.data, 'SaleData')
  }

}
