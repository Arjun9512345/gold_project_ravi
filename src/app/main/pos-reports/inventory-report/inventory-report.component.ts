import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {StoreMasterListModel} from "../../pos_master/pos_store/pos_store.component";
import {DatePipe} from "@angular/common";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {ExcelService} from "../../../../@pristine/process/excel.Service";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";

@Component({
  selector: 'app-inventory-report',
  templateUrl: './inventory-report.component.html',
  styleUrls: ['./inventory-report.component.scss']
})
export class InventoryReportComponent implements OnInit {
  inventoryReport: FormGroup;
  storeMasterListModels: Array<StoreMasterListModel> = [];
  storeFilterArray: Array<StoreMasterListModel> = [];
  today: any = new Date();
  length = 0;
  RowsPerPage = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  PageNumber = 0;
  brandMasterListModels: Array<any> = [];
  brandFilterArray: Array<any> = [];
  loadding: boolean = false;
  itemList: Array<CategoryModel>;
  itemListMaster: Array<CategoryModel>;
  displayedColumns: string[] = [
    'item_no', 'description', 'main_category', 'sub_category', 'color', 'size', 'style',
    'opening_stock', 'closing_stock', 'difference', 'on_hold',
    'difference_as_on_date'];
  subItemMasterListModels: Array<any> = [];
  subItemFilterArray: Array<any> = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private _toaster: ToastrService,
              private _spinner: NgxSpinnerService,
              private _webApiHttp: WebApiHttp,
              private fb: FormBuilder,
              private sessionManageMent: SessionManageMent,
              private datePipe: DatePipe,
              private excelService: ExcelService) {
  }

  ngOnInit(): void {
    // this.getBrands();
    this.getStore();
    this.getItemCategory();
    // this.getSubItemCategory();

    this.inventoryReport = this.fb.group({
      start_date: [this.today, Validators.required],
      end_date: [this.today, Validators.required],
      store: ['', Validators.required],
      category: [''],
      sub_category: [''],
      item: [''],
      brand: [''],
    });
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

  myPagginaterEvent(event) {
    this.RowsPerPage = event.pageSize;
    this.PageNumber = event.pageIndex;
    this.applyFilter('', '');
  }

  filterOptions(val: any, arr_name: string) {
    //store
    if (arr_name == 'store') {
      if (val == null || val == undefined || val == '') {
        this.storeFilterArray = this.storeMasterListModels;
      } else {
        this.storeFilterArray = this.storeMasterListModels.filter((unit) => unit?.name?.toLowerCase().indexOf(val.toLowerCase()) > -1);
      }
    }
    //  category
    if (arr_name == 'category') {
      if (val == null || val == undefined || val == '') {
        this.itemList = this.itemListMaster;
      } else {
        this.itemList = this.itemListMaster.filter((unit) => unit?.name?.toLowerCase().indexOf(val.toLowerCase()) > -1);
      }
    }
    //  sub category
    if (arr_name == 'sub_category') {
      if (this.subItemFilterArray.length == 0) {
        this.subItemFilterArray = this.subItemMasterListModels;
      } else {
        this.subItemFilterArray = this.subItemMasterListModels.filter((unit) => unit?.name?.toLowerCase().indexOf(val.toLowerCase()) > -1);
      }
    }
  }

  getStore() {
    this._spinner.show()
    this.storeMasterListModels = [];
    this.storeFilterArray = [];
    this._webApiHttp.Get(this._webApiHttp.ApiURLArray.pos_GetStoreLocationList + 'store&email_id=' + this.sessionManageMent.getEmail).then(result => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        this.storeMasterListModels = result;
        this.storeFilterArray = this.storeMasterListModels;
      } else {
        this._toaster.show('No Data Found');
      }
      this._spinner.hide()
    }).catch(err => {
      this._spinner.hide()
    });
  }

  getItemCategory() {
    this.itemListMaster = [];
    this.itemList = [];
    this._webApiHttp.Get(this._webApiHttp.ApiURLArray.ItemCategoryList).then(result => {
      // if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
      this.itemListMaster = result;
      this.itemList = this.itemListMaster;
      // console.log(result);
      // }
    });
  }

  getSubItemCategory() {
    this.subItemFilterArray = [];
    this.subItemMasterListModels = [];
    this._webApiHttp.Get(this._webApiHttp.ApiURLArray.ItemSubCategoryList + this.inventoryReport.get('category')?.value).then(result => {
      // if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
      this.subItemMasterListModels = result;
      this.subItemFilterArray = this.subItemMasterListModels;
      console.log(result);
      // }
    });
  }

  getReport() {

    this.dataSource = new MatTableDataSource<any>([]);
    if (this.inventoryReport.valid) {
      let json = {
        store_id: this.inventoryReport?.get('store')?.value,
        start_date: this.datePipe.transform(this.inventoryReport?.get('start_date')?.value, 'yyyy-MM-dd'),
        end_date: this.datePipe.transform(this.inventoryReport?.get('end_date')?.value, 'yyyy-MM-dd'),
        item_no: this.inventoryReport?.get('item')?.value,
        // brand: this.inventoryReport?.get('brand')?.value,
        category: this.inventoryReport?.get('category')?.value,
      };
      try {
        this._spinner.show()
        this._webApiHttp.Post(this._webApiHttp.ApiURLArray.get_inventory_report, json).then(res => {
          this._spinner.hide();
          this.dataSource = new MatTableDataSource<any>(res);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
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
    this.excelService.exportAsExcelFile(this.dataSource.data, 'Inventory Report')
  }

}

export class CategoryModel {
  attribute_type: string;
  code: string;
  name: string;
  sub_id: string;
}
