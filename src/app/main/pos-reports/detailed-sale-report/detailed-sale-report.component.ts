import {Component, OnInit, ViewChild} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';
import {WebApiHttp} from '../../../../@pristine/process/WebApiHttp.services';
import {EncriptDecript} from '../../../../@pristine/process/EncriptDecript';
import {Router} from '@angular/router';
import {ExcelService} from '../../../../@pristine/process/excel.Service';
import {SessionManageMent} from '../../../../@pristine/process/SessionManageMent';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {StoreMasterListModel} from '../../pos_master/pos_store/pos_store.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-detailed-sale-report',
  templateUrl: './detailed-sale-report.component.html',
  styleUrls: ['./detailed-sale-report.component.scss']
})
export class DetailedSaleReportComponent implements OnInit {

  displayedColumns: string[] = [ "sale_header_no","no_of_print","attach_sale_person","customer" , "amount",  "mid",   "gstpercentage",
       "qty",  "remain_amount",    "store_id",   "sub_total",
    "terminal_id",   "total_amount",  "total_amount_with_discount",  "total_discount",  "total_gst",
    "total_gst_amt", "order_status"];
  dataSource: MatTableDataSource<any>=new MatTableDataSource<any>();
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  store_code:string='';
  storeMasterListModels: Array<StoreMasterListModel> = [];
  show_store = false;
  showExcel=false;


  constructor(
    public sessionManageMent: SessionManageMent,
    public webApiHttp: WebApiHttp,
    private router: Router,
    private _encriptDecript: EncriptDecript,
    private _toster: ToastrService,
    private spinner: NgxSpinnerService,
    private  excelService:  ExcelService,
  ) {
    this.webApiHttp.Get(this.webApiHttp.ApiURLArray.pos_GetStoreLocationList + 'store&email_id='+this.sessionManageMent.getEmail).then(result => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        this.storeMasterListModels = result;
      }
    });
  }
  filter_dynamic: Array<{ filterKey: string, filter_value: string }> = [];

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


    // this.detailed_item_list('');
  }

  detailed_item_list(store_code:any) {
    try {
      this.spinner.show();
      this.dataSource.data=[];
      const json = {"store_id": store_code}
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.detailed_sale_report,json).then(
        result => {
          if (result[0].condition == 'True') {
            this.dataSource = new MatTableDataSource<any>(result);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.showExcel=true;


          }
          else {
            this._toster.info(result[0]?.message,'Info');
          }
          this.spinner.hide();
          return;
          //console.log(this.dataSource);
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

  downloadExcel() {
    for (let i = 0; i < this.dataSource.data.length; i++) {
      delete this.dataSource.data[i].condition
    }
    this.excelService.exportAsExcelFile(this.dataSource.data, 'SaleData')
  }




}
