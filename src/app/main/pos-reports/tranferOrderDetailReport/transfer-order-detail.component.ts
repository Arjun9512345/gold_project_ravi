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
  selector: 'app-transfer-order',
  templateUrl: './transfer-order-detail.component.html',
  styleUrls: ['./transfer-order-detail.component.scss']
})
export class TransferOrderDetailComponent implements OnInit {
  dataSourceHeader: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  dataSourceLine: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  transferOrderFormGroup: FormGroup;
  today: any = new Date();
  length = 0;
  RowsPerPage = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  PageNumber = 0;
  transferOrderHeaderData:Array<any> = [];
  transferOrderLineData:Array<any> = [];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('linesort', {static: true}) sortline: MatSort;
  @ViewChild('headerPaginator', {static: true}) paginatorheader: MatPaginator;
  @ViewChild('PaginatorLine', {static: true}) paginatorline: MatPaginator;
  displayedColumnsHeader: Array<any> = ['transfer_order_type','document_no','from_location_id','order_status','completed_on',
    'created_by',
    'created_date',
    'creation_type',
    'eway_bill_genrated',
    'eway_canceled',
    'freight_type',
    'gst_applicable',
    'irn_canceled',
    'irn_genrated',
    'receipt_no',
    'received_on',
    'recevied_by',
    'ship_date',
    'shipment_no',
    'shipped_by',
    'to_location_id',
    'total_gst_amount',
    'total_quantity',
    'total_quantity_received',
    'total_quantity_shipped',
    'total_transfer_cost',
    'total_transfer_cost_with_gst',
    ];

  displayedColumnsLine:Array<any> =[ 'document_no','document_line_no','barcode',
    'cgst_amount',
    'cgst_percentage',
    'good_qty',
    'gst_amount',
    'igst_amount',
    'igst_percentage',
    'item_no',
    'order_status',
    'ordered_quantity',
    'pick_ready_quantity',
    'received_qty',
    'received_qty_forcefully',
  'reservation_status',
  'reserved_quantity'];

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
              private sessionManageMent:SessionManageMent,
              private  excelService: ExcelService) { }

  ngOnInit(): void {
    this.getStore();
    // this.getCategory();
    this.transferOrderFormGroup = this._fb.group({
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
    if(val==null ||val==undefined || val==''){
      this.storeFilterArray = this.storeMasterListModels;
    }else{
      this.storeFilterArray = this.storeMasterListModels.filter((unit) => unit?.name?.toLowerCase().indexOf(val) > -1);
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
        location : this.transferOrderFormGroup.get('store').value,
        from_date : this._datePipe.transform(this.transferOrderFormGroup.get('start_date').value, 'yyyy-MM-dd') ,
        to_date : this._datePipe.transform(this.transferOrderFormGroup.get('end_date').value, 'yyyy-MM-dd') ,
        doc_no:  this.transferOrderFormGroup.get('doc_no').value?this.transferOrderFormGroup.get('doc_no').value:'',
      }
      this.transferOrderHeaderData =[]
      this.transferOrderLineData=[]
      this._webApiHttp.Post(this._webApiHttp.ApiURLArray.transfer_order_detail_report, json).then(res=> {
        this.loadding=false;
        if(res?.condition?.toLowerCase()=='true' && res?.transfer_header?.length>0 ){
            this.transferOrderLineData = res?.transfer_line
            this.transferOrderHeaderData = res?.transfer_header
        }else {
          this._toaster.show(res?.message)

        }

        this.dataSourceHeader = new MatTableDataSource<any>(this.transferOrderHeaderData);
        this.dataSourceLine = new MatTableDataSource<any>(this.transferOrderLineData);
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
    this.transferOrderFormGroup.reset();

    this.transferOrderFormGroup.get('start_date').setValue('');
    this.transferOrderFormGroup.get('end_date').setValue('');
    this.transferOrderFormGroup.get('store').setValue('');
  }

  downloadExcel() {

    for (let i = 0; i < this.transferOrderHeaderData?.length; i++) {
      delete this.transferOrderHeaderData[i]?.condition
      delete this.transferOrderHeaderData[i]?.irn_hash
      delete this.transferOrderHeaderData[i]?.qr_code
    }
    for (let i = 0; i < this.transferOrderLineData?.length; i++) {
      delete this.transferOrderLineData[i]?.condition
    }
    this.excelService.MultisheetWorkbook([this.transferOrderHeaderData, this.transferOrderLineData],['Transfer Order Header','Transfer Order Line'],'Transfer Order Details')
  }
}




























