import {Component, OnInit, ViewChild} from '@angular/core';
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {DatePipe} from "@angular/common";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {StoreMasterListModel} from "../../pos_master/pos_store/pos_store.component";
import {ItemListFilter} from "../../pos_point_of_sale/processSale/processSale.component";
import {ExcelService} from "../../../../@pristine/process/excel.Service";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";

@Component({
  selector: 'app-stock-ledger',
  templateUrl: './stock-ledger.component.html',
  styleUrls: ['./stock-ledger.component.scss']
})
export class StockLedgerComponent implements OnInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  stockInventoryFormGroup: FormGroup;
  categoryArray: Array<any> = [];
  categoryFilterArray : Array<any> =[];
  subCategoryArray :Array<any> =[];
  subCategoryFilterArray :Array<any> =[];
  itemArray: Array<any> =[];
  itemFilterArray: Array<any> =[];
  today: any = new Date();
  length = 0;
  RowsPerPage = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  PageNumber = 0;
  totalBalance: Array<any> = [];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns: Array<any> = ['document_no','document_type','barcode','item_no','location_id','entry_type','quantity','created_by','created_on'];
  loadding: boolean= false;
  storeMasterListModels: Array<StoreMasterListModel>= [];
  storeFilterArray:Array<StoreMasterListModel>=[];
  itemLoading: boolean = false;
  excelTable: Array<any>=[];
  constructor(private _webApiHttp: WebApiHttp,
              private _toaster: ToastrService,
              private _spinner: NgxSpinnerService,
              private _datePipe: DatePipe,
              private _fb: FormBuilder,
              private  sessionManageMent:SessionManageMent,
              private  excelService: ExcelService) { }

  ngOnInit(): void {
    this.getStore();
    // this.getCategory();
    this.stockInventoryFormGroup = this._fb.group({
      start_date:[this.today, Validators.required],
      end_date:[this.today, Validators.required],
      // category:['', Validators.required],
      // sub_category:['', Validators.required],
      store:['', Validators.required],
      item:[''],
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
  filterOptions(val: any) {
    if(val==null || val==undefined || val==''){
      this.storeFilterArray = this.storeMasterListModels;
    }else{
      this.storeFilterArray = this.storeMasterListModels.filter((unit) => unit?.name?.toLowerCase().indexOf(val.toLowerCase()) > -1);
    }
  }
  getCategory(){
    this.categoryArray =[];
    this.categoryFilterArray =[];
    this._webApiHttp.Get(this._webApiHttp.ApiURLArray.ItemCategoryList).then(result => {
      // if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
      this.categoryArray = result;
      this.categoryFilterArray = this.categoryArray;
      // console.log(result);
      // }
    });
  }
  getStore(){
    this._spinner.show()
    this.storeMasterListModels = [];
    this.storeFilterArray = [];
    this._webApiHttp.Get(this._webApiHttp.ApiURLArray.pos_GetStoreLocationList + 'store&email_id='+this.sessionManageMent.getEmail).then(result => {
      this._spinner.hide()
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        this.storeMasterListModels = result;
        this.storeFilterArray = this.storeMasterListModels;
        // console.log(result);
      }else{
        this._toaster.error("Something went wrong","Error")
      }
    }).catch(err=>{this._spinner.hide()});
  }
  getSubCategory(){
    this.subCategoryArray=[];
    this.subCategoryFilterArray =[];
    this._webApiHttp.Get(this._webApiHttp.ApiURLArray.ItemSubCategoryList + this.stockInventoryFormGroup.get('category').value).then(result => {
      // if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
      this.subCategoryArray = result;
      this.subCategoryFilterArray = this.subCategoryArray;
      // console.log(result);
      // }
    });
  }
  getItem(val){
    // this.itemArray=[];
    // this.itemFilterArray =[];
    this.itemLoading = true;
    this._webApiHttp.Post(this._webApiHttp.ApiURLArray.get_item_without_store, {
      filter: val,
    }).then(res=>{
      this.itemLoading = false;
      var response: Array<ItemListFilter> = res;
      if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
        this.itemArray = response;
      }
    }).catch(err=>{
      this.itemLoading = false;
    });
  }

  getReport() {
    this._spinner.show();
    try{
      this.loadding = true;
      let json = {
        store_id : this.stockInventoryFormGroup.get('store').value,
        start_date : this._datePipe.transform(this.stockInventoryFormGroup.get('start_date').value, 'yyyy-MM-dd') ,
        end_date : this._datePipe.transform(this.stockInventoryFormGroup.get('end_date').value, 'yyyy-MM-dd') ,
        item_no :  this.stockInventoryFormGroup.get('item').value,
      }
      this._webApiHttp.Post(this._webApiHttp.ApiURLArray.get_stock_inventory_report, json).then(res=> {
        this.loadding=false;
        if(res[0]?.condition?.toLowerCase()=='false'){
          this._toaster.show(res[0]?.message)
        }
        this.dataSource = new MatTableDataSource<any>(res);
        this.excelTable = Object.assign([],res);
        this.dataSource.paginator= this.paginator;
        this.dataSource.sort= this.sort;
        this._spinner.hide();
      }).catch(err=>{this._spinner.hide();
      });
    }catch(e){}
  }

  reset() {
    this.stockInventoryFormGroup.reset();

    this.stockInventoryFormGroup.get('start_date').setValue('');
    this.stockInventoryFormGroup.get('end_date').setValue('');
    // this.stockInventoryFormGroup.get('category').setValue('');
    // this.stockInventoryFormGroup.get('sub_category').setValue('');
    this.stockInventoryFormGroup.get('store').setValue('');
    this.stockInventoryFormGroup.get('item').setValue('');
  }

  downloadExcel() {
    for (let i = 0; i < this.excelTable?.length; i++) {
      delete this.excelTable[i]?.condition
    }
    console.log(this.excelTable)
    this.excelService.exportAsExcelFile(this.excelTable, 'Stock Ledger Report ('+ this.stockInventoryFormGroup.get('item').value+')');
  }
}

export class stockInventoryModel{
  date: string;
  document_type: string;
  document_no: string;
  customer_name: string;
  phone_no: string;
  quantity: number;
  balance:number;
}
