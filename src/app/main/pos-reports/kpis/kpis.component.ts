import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StoreMasterListModel} from "../../pos_master/pos_store/pos_store.component";
import {ItemListFilter} from "../../pos_point_of_sale/processSale/processSale.component";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {DatePipe} from "@angular/common";
import {ExcelService} from "../../../../@pristine/process/excel.Service";

@Component({
  selector: 'app-kpis',
  templateUrl: './kpis.component.html',
  styleUrls: ['./kpis.component.scss']
})
export class KPISComponent implements OnInit {

  kpisReport: FormGroup;
  storeMasterListModels: Array<StoreMasterListModel> =[];
  storeFilterArray: Array<StoreMasterListModel> =[];
  today: any = new Date();
  length = 0;
  RowsPerPage = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  PageNumber = 0;
  brandMasterListModels: Array<any> =[];
  brandFilterArray: Array<any> =[];
  loadding: boolean = false;
  itemList: Array<ItemListFilter>;
  itemListMaster: Array<ItemListFilter>;
  displayedColumns: string[] = [
    'Store_Name','bills','qty','revenue',
    'sum_of_mrp', 'Aov','ASP', 'UPT',
    'dis_prcnt'];
  subItemMasterListModels: Array<any> =[];
  subItemFilterArray: Array<any> =[];
  dataSource: MatTableDataSource<any>=new MatTableDataSource<any>();
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(private _toaster: ToastrService,
              private _spinner: NgxSpinnerService,
              private _webApiHttp: WebApiHttp,
              private fb: FormBuilder,
              private datePipe: DatePipe,
              private  excelService:  ExcelService) { }

  ngOnInit(): void {
    this.kpisReport = this.fb.group({
      start_date: [this.today, Validators.required],
      end_date: [this.today, Validators.required],

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

  getReport(){

    this.dataSource = new MatTableDataSource<any>([]);
     if(this.kpisReport.valid) {
      let json = {
        startDate : this.datePipe.transform(this.kpisReport?.get('start_date')?.value, 'yyyy-MM-dd'),
        endDate : this.datePipe.transform(this.kpisReport?.get('end_date')?.value, 'yyyy-MM-dd'),

      };
      try {
        this._spinner.show()
        this._webApiHttp.Post(this._webApiHttp.ApiURLArray.pos_get_store_Wise_Sale_Report, json).then(res => {
          if(res[0]?.condition.toLowerCase()=='true') {
            this._spinner.hide();
            this.dataSource = new MatTableDataSource<any>(res);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
          }
        else{
            this._toaster.show('No Data Found');
          }
          this._spinner.hide();
        }).catch(err => {
          this._spinner.hide();

        })
      } catch (e) {
        this._spinner.hide();
      }

    }
  }

  downloadExcel() {
    for (let i = 0; i < this.dataSource.data.length; i++) {
      delete this.dataSource.data[i].condition
    }
    this.excelService.exportAsExcelFile(this.dataSource.data, 'KIPS Report')
  }

}
