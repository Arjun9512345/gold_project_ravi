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
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Credit_noteListModel, CreditNoteListModel} from "../../pos_point_of_sale/credit_note/credit_note.component";
import {CategoryModel} from "../inventory-report/inventory-report.component";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";

@Component({
  selector: 'app-store-wise-inventory',
  templateUrl: './store-wise-inventory.component.html',
  styleUrls: ['./store-wise-inventory.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class StoreWiseInventoryComponent implements OnInit {

  storeWiseInventoryReport: FormGroup;
  storeMasterListModels: Array<StoreMasterListModel> =[];
  storeFilterArray: Array<StoreMasterListModel> =[];
  today: any = new Date();
  length = 0;
  expandItemno:string = '';
  RowsPerPage = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  PageNumber = 0;
  brandMasterListModels: Array<any> =[];
  brandFilterArray: Array<any> =[];
  loadding: boolean = false;
  itemList: Array<CategoryModel>;
  itemListMaster: Array<CategoryModel>;
  displayedColumns: string[] = ['barcode','item_no','description','category', 'total','action'];
  subItemMasterListModels: Array<any> =[];
  subItemFilterArray: Array<any> =[];
  itemArray: Array<any> =[];
  itemFilterArray: Array<any> =[];
  itemLoading:boolean =false;
  dataSource: MatTableDataSource<storewiseModel>=new MatTableDataSource<storewiseModel>();
  tableData: Array<any>=[];
  locArr =[];
  open_index:number = -1;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private _toaster: ToastrService,
              private _spinner: NgxSpinnerService,
              private _webApiHttp: WebApiHttp,
              private fb: FormBuilder,
              private  sessionManageMent:SessionManageMent,
              private excelService: ExcelService,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getStore();
    this.getItemCategory();

    this.storeWiseInventoryReport = this.fb.group({
      store: ['', Validators.required],
      category: [''],
      item: [''],
      // sub_category :[''],
      // brand: [''],
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
  filterOptions(val: any,arr_name:string) {
    //store
    if(arr_name =='store'){
      if(val==null || val==undefined || val==''){
        this.storeFilterArray = this.storeMasterListModels;
      }else{
        this.storeFilterArray = this.storeMasterListModels.filter((unit) => unit?.name?.toLowerCase().indexOf(val) > -1);
      }
    }
    //  category
    if(arr_name=='category'){
      if(val==null || val==undefined || val==''){
        this.itemList = this.itemListMaster;
      }else{
        this.itemList = this.itemListMaster.filter((unit) => unit?.name?.toLowerCase().indexOf(val) > -1);
      }
    }
    //  sub category
    // if(arr_name =='sub_category'){
    //   if(this.subItemFilterArray.length==0){
    //     this.subItemFilterArray = this.subItemMasterListModels;
    //   }else{
    //     this.subItemFilterArray = arr.filter((unit) => unit?.name?.toLowerCase().indexOf(val) > -1);
    //   }
    // }
  }
  getStore(){
    this._spinner.show()
    this.storeMasterListModels = [];
    this.storeFilterArray = [];
    this._webApiHttp.Get(this._webApiHttp.ApiURLArray.pos_GetStoreLocationList + 'store&email_id='+this.sessionManageMent.getEmail).then(result => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        this.storeMasterListModels = result;
        this.storeFilterArray = this.storeMasterListModels;
        // console.log(result);
      }else{
        this._toaster.show('No Data Found');
      }
      this._spinner.hide()
    }).catch(err=>this._spinner.hide());
  }

  getItemCategory(){
    this.itemListMaster =[];
    this.itemList =[];
    this._webApiHttp.Get(this._webApiHttp.ApiURLArray.ItemCategoryList).then(result => {
      // if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
      this.itemListMaster = result;
      this.itemList = this.itemListMaster;
      // console.log(result);
      // }
    });
  }
  getSubItemCategory(){
    this.subItemFilterArray=[];
    this.subItemMasterListModels =[];
    this._webApiHttp.Get(this._webApiHttp.ApiURLArray.ItemSubCategoryList + this.storeWiseInventoryReport.get('category').value).then(result => {
      // if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
      this.subItemMasterListModels = result;
      this.subItemFilterArray = this.subItemMasterListModels;
      // console.log(result);
      // }
    });
  }
  getItem(val){
    this.itemArray=[];
    this.itemFilterArray =[];
    this.itemLoading =true;
    this._webApiHttp.Post(this._webApiHttp.ApiURLArray.get_item_without_store, {
      filter: val,
    }).then(res=>{    this.itemLoading =true;
      this.itemLoading =false;
      var response: Array<ItemListFilter> = res;
      if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
        this.itemArray = response;
      }
    }).catch(err=>{    this.itemLoading =false;
    });
  }

  getReport(){
    if(this.storeWiseInventoryReport?.get('item')?.value == '' &&this.storeWiseInventoryReport?.get('category')?.value == ''){
      this._toaster.error('Either enter category or item', 'Error')
      return;
    }
    this.dataSource = new MatTableDataSource<storewiseModel>([]);
    this.tableData = [];
    this.locArr = this.storeWiseInventoryReport.get('store').value;
    this._spinner.show();
    // this.tableData = []
    if(this.storeWiseInventoryReport.valid) {
      let storeList: Array<any> =[];
      for(let i = 0; i<this.storeWiseInventoryReport.get('store').value.length;i++){
        storeList[i]=({store_id:this.storeWiseInventoryReport.get('store').value[i]})
      }
        let json = {
          stores: storeList,
          item_no: this.storeWiseInventoryReport?.get('item')?.value,
          // brand: this.storeWiseInventoryReport?.get('brand')?.value,
          category: this.storeWiseInventoryReport?.get('category')?.value,
        };
        try {
          this._webApiHttp.Post(this._webApiHttp.ApiURLArray.get_storewise_inventory_report, json).then(res => {
            this._spinner.hide();
            if(res[0]?.condition == 'True') {
              this.dataSource = new MatTableDataSource<storewiseModel>(res[0]?.data);
              // this.tableData = res;
              this.tableData = res[0]?.data;
              this.dataSource.sort = this.sort;
              this.dataSource.paginator = this.paginator;
               this.MakeTable(res[0]?.data);
               // console.log('done');
            }
          }).catch(err => {
            this._spinner.hide();
          })
        } catch (e) {        }
    }else{
      this._toaster.show('Invalid', 'Store, End Date,Start Date, Brand or Sub-Category required');
    }
  }

  MakeTable(res){
    let item = []
    // console.log('inside function')
    // for(let i=0; i<res?.length;i++){
    //   item[i]= res[i]?.item_no;
    // }
    // console.log(item);
    // console.log(this.locArr);
      //   for(let loc = 0; loc<this.locArr.length;loc++){
      //   this.tableData[loc]= {location : this.locArr[loc]};
      // }

    for(let loc = 0; loc<this.locArr.length;loc++){
      this.tableData[loc]= {location : this.locArr[loc]};
      for(let i=0; i<res?.length;i++){
        item[i]= res[i]?.item_no;
        this.tableData[loc][item[i]]= 0;
      }
    }
    this.tableData[this.locArr.length]={location: 'Total'};
    for(let x=0; x<res?.length; x++){
      this.tableData[this.locArr.length][res[x]?.item_no]=res[x]?.ibi[0]?.total_quantity;
    }

    // console.log(this.tableData);

    for(let obj = 0; obj<res?.length;obj++){
      for(let line =0; line<res[obj]?.ibi?.length; line++){
        for(let name=0; name<item.length;name++){
          for(let tbl =0; tbl<this.locArr.length; tbl++) {

            // console.log(res[obj]?.item_no,item[name],res[obj]?.ibi[line]?.location_id,this.locArr[tbl],res[obj]?.ibi[line]);

           this.tableData[tbl][item[name]] = (res[obj]?.item_no == item[name] &&
             res[obj]?.ibi[line]?.location_id == this.locArr[tbl] )? res[obj]?.ibi[line]?.quantity : this.tableData[tbl][item[name]];

           // console.log(this.tableData[tbl]);
         }
       }
     }
    }
    // console.log(this.tableData)
  }

  downloadExcel() {
    for (let i = 0; i < this.dataSource.data.length; i++) {
      // delete this.dataSource.data[i].condition
    }
    this.excelService.exportAsExcelFile(this.tableData, 'Store-Wise Report')
  }
  selected_Row(element: any, i:any) {
    console.log(element)
    console.log(i)
    console.log(this.dataSource.data[i])
    // let position = -1;
    // for (let i = 0; i < this.dataSource.data.length; i++) {
    //
    //   // this.dataSource?.data[i]?.Action = 'collapsed'
    //   this.dataSource.data[i].ibi = []
    //   if (element.mid == this.dataSource.data[i].mid
    //     && element.item_no == this.dataSource.data[i].item_no) {
    //     position = i;
    //     break;
    //   }
    // }
    // if (position != -1) {
    // //   await this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_credit_note_detail + element.credit_no).then((result: Array<Credit_noteListModel>) => {
    // //     if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
    // //       this.dataSource.data[position].ibi = this.tableData[position]?.ibi;
    //     // }
    // //   })
    //   this.dataSource.data[position].Action = this.dataSource.data[position].Action == 'collapsed'? 'expanded': 'collapsed' ;
    // }
  }

}

class storewiseModel {
  condition:string;
  description: string;
  item_no:string;
  mid: string;
  total_quantity: number;
  action: string;
    location:Array<
      {location_id: string;
        name:string;
        quantity:number;
        }>;
}
