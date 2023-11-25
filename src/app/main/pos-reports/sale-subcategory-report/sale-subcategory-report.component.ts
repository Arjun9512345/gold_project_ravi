import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SessionManageMent} from '../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../@pristine/process/WebApiHttp.services';
import {ToastrService} from 'ngx-toastr';
import {EncriptDecript} from '../../../../@pristine/process/EncriptDecript';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {DatePipe} from '@angular/common';
import {StoreMasterListModel} from '../../pos_master/pos_store/pos_store.component';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {ExcelService} from '../../../../@pristine/process/excel.Service';
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-sale-subcategory-report',
  templateUrl: './sale-subcategory-report.component.html',
  styleUrls: ['./sale-subcategory-report.component.scss']
})
export class SaleSubcategoryReportComponent implements OnInit {

  today = new Date();
  salesubcategoryForm: FormGroup;
  total_amount:any=0;
  showTable:boolean=false;
  showExcel=false;
  storeMasterListModels: Array<StoreMasterListModel> = [];
  displayedColumns: string[] = ['item_no','sub-category','store_id','qty','quantity_to_take'];
  dataSource: MatTableDataSource<any>=new MatTableDataSource<any>();
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
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
    this.webApiHttp.Get(this.webApiHttp.ApiURLArray.pos_GetStoreLocationList + 'store&email_id='+this.sessionManageMent.getEmail).then(result => {
      if (result?.length > 0 && result[0]?.condition.toLowerCase() == 'true') {
        this.storeMasterListModels = result;
      }
    });
    this.salesubcategoryForm = _formBuilder.group({
      store_id: ['', Validators.required],
      from_date: ['', Validators.required],
      to_date: ['', Validators.required],
    });
  }
  applyFilter(filterValue: string, keyName: string) {
    this.dataSource.filter = filterValue;
    this.dataSource.filterPredicate = function(data, filter: string): boolean {
      if (data[keyName] != undefined && data[keyName] != null && data[keyName] != '') {
        return (data[keyName] != null && data[keyName] != undefined ? data[keyName]?.toString()?.toLowerCase() : '')?.includes(filter?.toLowerCase());
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
    this.RowsPerPage = event?.pageSize;
    this.PageNumber = event?.pageIndex;
    this.applyFilter('', '');
  }
  ngOnInit(): void {
  }
  getSaleCategoryReport(){
    this.total_amount=0;
    this.dataSource.data=[];
    let location_string='';
    let temp_loc:Array<string>=this.salesubcategoryForm.get('store_id').value;
    for(let i=0;i<temp_loc.length;i++){
      location_string+=temp_loc[i]+((i==temp_loc.length-1)?'':'___')
    }
    const json={
     store_id: location_string,
      from_date: this.datePipe?.transform(this.salesubcategoryForm?.get('from_date')?.value,'yyyy-MM-dd'),
      to_date: this.datePipe?.transform(this.salesubcategoryForm?.get('to_date')?.value,'yyyy-MM-dd'),
      flag: 'subcategory',
    }
    this.spinner.show();

    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.sale_category_report,json).then(result => {
      if(result[0].condition.toLowerCase()=='true'){
        this.dataSource = new MatTableDataSource<any>(result);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
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
    for (let i = 0; i < this.dataSource.data?.length; i++) {
      delete this.dataSource?.data[i]?.condition
    }
    this.excelService.exportAsExcelFile(this.dataSource?.data, 'SaleData')
  }

}
