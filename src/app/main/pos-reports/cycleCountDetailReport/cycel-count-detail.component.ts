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
  selector: 'app-cycle-count',
  templateUrl: './cycel-count-detail.component.html',
  styleUrls: ['./cycel-count-detail.component.scss']
})
export class CycelCountDetailComponent implements OnInit {
  dataSourceHeader: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  dataSourceLine: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  cycleCountFormGroup: FormGroup;
  today: any = new Date();
  length = 0;
  RowsPerPage = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  PageNumber = 0;
  cycleCountHeaderData:Array<any> = [];
  cycleCountLineData:Array<any> = [];
  @ViewChild('headersort', {static: true}) sort: MatSort;
  @ViewChild('linesort', {static: true}) sortline: MatSort;
  @ViewChild('headerPaginator', {static: true}) paginatorheader: MatPaginator;
  @ViewChild('PaginatorLine', {static: true}) paginatorline: MatPaginator;
  displayedColumnsHeader: Array<any> = ['document_type', 'document_no', 'location_id', 	'status', 'completed_on',
    'is_approved', 'approval_id', 'approve_on', 'total_qty', 'total_items', 'total_approve_qty', 'created_on', 'created_by'


  ];

  displayedColumnsLine:Array<any> =[ 'document_no', 'line_no', 'item_no', 'barcode', 'scan_qty', 'approve_qty',
    'update_on', 'reserved_qty_so', 'reserved_qty_transfer', 'total_reserved',
    'total_qty_available_inventory', 'total_qty_inventory', 'adjustment_type',
    'diffrence_actual_qty', 'adj_type', 'manual_adjust'
  ];

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
    this.cycleCountFormGroup = this._fb.group({
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
    //store
      if(!val){
        this.storeFilterArray = this.storeMasterListModels;
      }else{
        this.storeFilterArray = this.storeFilterArray.filter((unit) => unit?.name?.toLowerCase().indexOf(val) > -1);
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
        location : this.cycleCountFormGroup.get('store').value,
        from_date : this._datePipe.transform(this.cycleCountFormGroup.get('start_date').value, 'yyyy-MM-dd') ,
        to_date : this._datePipe.transform(this.cycleCountFormGroup.get('end_date').value, 'yyyy-MM-dd') ,
        doc_no:  this.cycleCountFormGroup.get('doc_no').value?this.cycleCountFormGroup.get('doc_no').value:'',
      }
      this.cycleCountHeaderData =[]
      this.cycleCountLineData=[]
      this._webApiHttp.Post(this._webApiHttp.ApiURLArray.cycle_count_report, json).then(res=> {
        this.loadding=false;
        if(res?.condition?.toLowerCase()=='true'){
            this.cycleCountLineData = res?.cycle_count_line
            this.cycleCountHeaderData = res?.cycle_count_header

        }else {
          this._toaster.show(res[0]?.message)

        }

        this.dataSourceHeader = new MatTableDataSource<any>(this.cycleCountHeaderData);
        this.dataSourceLine = new MatTableDataSource<any>(this.cycleCountLineData);
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
    this.cycleCountFormGroup.reset();

    this.cycleCountFormGroup.get('start_date').setValue('');
    this.cycleCountFormGroup.get('end_date').setValue('');
    this.cycleCountFormGroup.get('store').setValue('');
  }

  downloadExcel() {

    for (let i = 0; i < this.cycleCountHeaderData?.length; i++) {
      delete this.cycleCountHeaderData[i]?.condition
    }
    for (let i = 0; i < this.cycleCountLineData?.length; i++) {
      delete this.cycleCountLineData[i]?.condition
    }
    this.excelService.MultisheetWorkbook([this.cycleCountHeaderData, this.cycleCountLineData],['Cycle Count Header','Cycle Count Line'],'Cycle Count Details')
  }
}





















