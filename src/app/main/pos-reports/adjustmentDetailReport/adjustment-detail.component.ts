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
import {ExcelService} from "../../../../@pristine/process/excel.Service";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";

@Component({
  selector: 'app-adjustment',
  templateUrl: './adjustment-detail.component.html',
  styleUrls: ['./adjustment-detail.component.scss']
})
export class AdjustmentDetailComponent implements OnInit {
  dataSourceHeader: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  dataSourceLine: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  adjustmentFormGroup: FormGroup;
  today: any = new Date();
  length = 0;
  RowsPerPage = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  PageNumber = 0;
  adjustmentHeaderData:Array<any> = [];
  adjustmentLineData:Array<any> = [];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('linesort', {static: true}) sortline: MatSort;
  @ViewChild('headerPaginator', {static: true}) paginatorheader: MatPaginator;
  @ViewChild('PaginatorLine', {static: true}) paginatorline: MatPaginator;
  displayedColumnsHeader: Array<any> = ['adj_type','adjustment_no','store_id',
    'complated_on','approval_status',
    'created_by','created_on','approved_by','approved_on' ];

  displayedColumnsLine:Array<any> =['adjustment_no','adjustment_line_no','barcode','item_code','quantity','approved_quantity','scanned_on'];

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
    this.adjustmentFormGroup = this._fb.group({
      start_date:[this.today, Validators.required],
      end_date:[this.today, Validators.required],
      store:['', Validators.required],
      doc_no:[''],
    });
  }
  applyFilter(filterValue: string, keyName: string,tble :string) {
    if(tble == 'header'){
      this.dataSourceHeader.filter = filterValue;
      this.dataSourceHeader.filterPredicate = function(data, filter: string): boolean {
        if (data[keyName] != undefined && data[keyName] != null && data[keyName] != '') {
          return (data[keyName] != null && data[keyName] != undefined ? data[keyName].toString().toLowerCase() : '').includes(filter.toLowerCase());
        } else {
          return false;
        }
      };
    }else if(tble =='line'){
      this.dataSourceLine.filter = filterValue;
      this.dataSourceLine.filterPredicate = function(data, filter: string): boolean {
        if (data[keyName] != undefined && data[keyName] != null && data[keyName] != '') {
          return (data[keyName] != null && data[keyName] != undefined ? data[keyName].toString().toLowerCase() : '').includes(filter.toLowerCase());
        } else {
          return false;
        }
      };
    }

  }

  filterOptions(val: any) {
    if(val==null || val==undefined || val==''){
      this.storeFilterArray = this.storeMasterListModels;
    }else{
      this.storeFilterArray = this.storeMasterListModels.filter((unit) =>( unit?.name?.toLowerCase().indexOf(val) > -1 || unit?.id?.toLowerCase().indexOf(val) > -1));
    }
  }
  myPagginaterEvent(event) {
    this.RowsPerPage = event.pageSize;
    this.PageNumber = event.pageIndex;
    this.applyFilter('', '','');
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
  getReport() {
    this._spinner.show();
    try{
      this.loadding = true;
      let json = {
        location : this.adjustmentFormGroup.get('store').value,
        from_date : this._datePipe.transform(this.adjustmentFormGroup.get('start_date').value, 'yyyy-MM-dd') ,
        to_date : this._datePipe.transform(this.adjustmentFormGroup.get('end_date').value, 'yyyy-MM-dd') ,
        doc_no:  this.adjustmentFormGroup.get('doc_no').value?this.adjustmentFormGroup.get('doc_no').value:'',
      }
      this.adjustmentHeaderData =[]
      this.adjustmentLineData=[]
      this._webApiHttp.Post(this._webApiHttp.ApiURLArray.adjustment_detail_report, json).then(res=> {
        this.loadding=false;
        if(res?.condition?.toLowerCase()=='true'){
          this.adjustmentLineData = res?.adjustment_line
          this.adjustmentHeaderData = res?.adjustment_header
        }else {
          this._toaster.show(res[0]?.message)
        }

        this.dataSourceHeader = new MatTableDataSource<any>(this.adjustmentHeaderData);
        this.dataSourceLine = new MatTableDataSource<any>(this.adjustmentLineData);
        this.excelTable = Object.assign([], res);
        this.dataSourceHeader.paginator = this.paginatorheader;
        this.dataSourceLine.paginator = this.paginatorline;
        this.dataSourceHeader.sort = this.sort;
        this.dataSourceLine.sort = this.sortline;
        this._spinner.hide();
      }).catch(err=>{this._spinner.hide();
      });
    }catch(e){}
  }

  reset() {
    this.adjustmentFormGroup.reset();

    this.adjustmentFormGroup.get('start_date').setValue('');
    this.adjustmentFormGroup.get('end_date').setValue('');
    this.adjustmentFormGroup.get('store').setValue('');
    this.adjustmentFormGroup.get('doc_no').setValue('');
  }

  downloadExcel() {

    for (let i = 0; i < this.adjustmentHeaderData?.length; i++) {
      delete this.adjustmentHeaderData[i]?.condition
    }
    for (let i = 0; i < this.adjustmentLineData?.length; i++) {
      delete this.adjustmentLineData[i]?.condition
    }
    this.excelService.MultisheetWorkbook([this.adjustmentHeaderData, this.adjustmentLineData],['Adjustment Header','Adjustment Line'],'Adjustment Details')
  }
}

export class adjustmentModel{
  date: string;
  document_type: string;
  document_no: string;
  customer_name: string;
  phone_no: string;
  quantity: number;
  balance:number;
}
























