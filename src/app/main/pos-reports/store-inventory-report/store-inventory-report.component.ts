import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {StoreMasterListModel} from "../../pos_master/pos_store/pos_store.component";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {Router} from "@angular/router";
import {EncriptDecript} from "../../../../@pristine/process/EncriptDecript";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {ExcelService} from "../../../../@pristine/process/excel.Service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-store-inventory-report',
  templateUrl: './store-inventory-report.component.html',
  styleUrls: ['./store-inventory-report.component.scss']
})
export class StoreInventoryReportComponent implements OnInit {

  displayedColumns: string[] = ['item_no','description','mid', 'mrp','size','style','main_category','quantity'  ];
  dataSource: MatTableDataSource<any>=new MatTableDataSource<any>([]);
  CategoryRep: MatTableDataSource<any>=new MatTableDataSource<any>([]);
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('category') cat : TemplateRef<any>;
  store_code:string='';
  storeMasterListModels: Array<StoreMasterListModel> = [];
  show_store = false;
  showExcel=false;
cat_total: number =0;

  constructor(
    public sessionManageMent: SessionManageMent,
    public webApiHttp: WebApiHttp,
    private router: Router,
    private _encriptDecript: EncriptDecript,
    private _toster: ToastrService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
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

  getReport(store_code:any) {
    try {
      this.spinner.show();
      this.dataSource.data=[];
      // const json = {"store_id": store_code}
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_store_inventory_report+store_code).then(
        result => {

          if (result[0]?.condition?.toLowerCase() == 'true') {
            console.log(result[0]?.item_wise_inv)
            this.dataSource = new MatTableDataSource<any>(result[0]?.item_wise_inv);
            this.CategoryRep = new MatTableDataSource<any>(result[0]?.category_wise_inv);
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
    // this.excelService.exportAsExcelFile(this.dataSource.data, 'StoreInventoryReport')
    // this.excelService.exportAsSaleHeaderManifest(this.dataSource.data, this.CategoryRep.data,'StoreInventoryReport')
    let cat =this.CategoryRep.data?.map(e=>e)
    cat.push({'cat_name':'Grand Total','inv': this.getTotal()})
    this.excelService.MultisheetWorkbook([this.dataSource.data,cat],['ItemDetails', 'Category Details'] ,'StoreInventoryReport')
  }


  showPopUp() {
   let dig = this.dialog.open(this.cat,{
     width:'500px'
   })
  }

  getTotal() {
    this.cat_total =this.CategoryRep.data.map(t=> t.inv).reduce((acc, val)=> acc+val,0);
    return this.CategoryRep.data.map(t=> t.inv).reduce((acc, val)=> acc+val,0);
  }
}
