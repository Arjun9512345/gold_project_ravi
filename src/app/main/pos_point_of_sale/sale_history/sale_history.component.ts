import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {WebApiHttp} from '../../../../@pristine/process/WebApiHttp.services';
import {SessionManageMent} from '../../../../@pristine/process/SessionManageMent';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {EncriptDecript} from "../../../../@pristine/process/EncriptDecript";
import {CreateSaleHistoryPopupComponent} from "./create-sale_history_popup/create-sale_history_popup.component";
import {StoreMasterListModel} from "../../pos_master/pos_store/pos_store.component";
import {PaggingModel} from "../../../modal/PaggingModel";

@Component({
  selector: 'app-sale_history',
  templateUrl: './sale_history.component.html',
  styleUrls: ['./sale_history.component.scss']
})
export class Sale_historyComponent implements OnInit {

  store_code: string = '';
  order_type:string='';
  storeMasterListModels: Array<StoreMasterListModel> = [];
  displayedColumns: string[] = ['sale_datetime', 'sale_header_no', 'parent_so_no', 'cust_details','cust_phone_no',
    'return_status', 'sub_total', 'total_amount_with_discount', 'total_gst', 'total_amount'];
  viewBrandDataSource: MatTableDataSource<SaleHistoryListModel> = new MatTableDataSource<SaleHistoryListModel>();
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  loadding: boolean = false;

  constructor(public sessionManageMent: SessionManageMent,
              public webApiHttp: WebApiHttp,
              private _formBuilder: FormBuilder,
              private _toster: ToastrService,
              private router: Router,
              private encriptDecript: EncriptDecript,
              private dialog: MatDialog,
              private route: ActivatedRoute) {
    try {
      let paggingData: PaggingModel = this.sessionManageMent.getSaleHistoryPagging;
      if (paggingData != null && paggingData != undefined) {
        this.PageNumber = paggingData.page_number;
      }
    } catch (e) {

    }
  }

  ngOnInit(): void {
    try {
      this.cust_phone_no = JSON.parse(this.encriptDecript.decrypt(this.route.snapshot.paramMap.get('customer_phone_no')));
    } catch (e) {
    }

    this.order_type='SALE ORDER';
    this.webApiHttp.Get(this.webApiHttp.ApiURLArray.pos_GetStoreLocationList + 'store&email_id='+this.sessionManageMent.getEmail).then(result => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        this.storeMasterListModels = result;
        this.store_code = this.sessionManageMent.getLocationId;
      }
    }).finally(() => {
      this.getSaleHistoryViewList();
    });


  }

  displaySaleHeaderData(data: SaleHistoryListModel) {
    this.webApiHttp.Get(this.webApiHttp.ApiURLArray.pos_get_sale_details + data.sale_header_no).then((result: Array<SaleHeaderHistoryDataModel>) => {
      const dialogRef = this.dialog.open(CreateSaleHistoryPopupComponent, {
        data: {
          flag: 'Sales Order Detail',
          saleReturnData: result
        }, width: '800px'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {

        }
      });
    });
  }

  applyFilter(filterValue: string, keyName: string) {
    if(keyName=='sale_datetime')
      this.sale_datetime=filterValue;
    if(keyName=='sale_header_no')
      this.sale_header_no=filterValue;
    if(keyName=='parent_so_no')
      this.parent_so_no=filterValue;
    if(keyName=='cust_details')
      this.customer_detail=filterValue;
    if(keyName=='cust_phone_no'){
      this.router.navigateByUrl('/pointofsale/sale_history');
      this.cust_phone_no=filterValue;
    }
    this.getSaleHistoryViewList();
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

  sale_datetime:string='';
  sale_header_no:string='';
  parent_so_no:string='';
  customer_detail:string='';
  cust_phone_no:string='';

  getSaleHistoryViewList() {
    this.loadding = true;
    var json = {
      filter: this.order_type,
      email_id: this.sessionManageMent.getEmail,
      store_id: this.store_code,
      RowsPerPage:this.RowsPerPage,
      PageNumber:this.PageNumber,
      sale_datetime:this.sale_datetime,
      sale_header_no:this.sale_header_no,
      parent_so_no:this.parent_so_no,
      customer_detail:this.customer_detail,
      customer_phone_no:this.cust_phone_no
    }
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.get_all_invoice_sale_ho, json).then((result) => {
        var response: Array<SaleHistoryListModel> = result;
      if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
        this.viewBrandDataSource = new MatTableDataSource<SaleHistoryListModel>(response);
        this.viewBrandDataSource.sort = this.sort;
        this.length = response[0].total_rows;
        this.clickOnRow('');
      } else {
        this.viewBrandDataSource = new MatTableDataSource<SaleHistoryListModel>([]);
        this.viewBrandDataSource.sort = this.sort;
        this.length = 0;
        this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
      }
    }).catch(error => {
      this._toster.error(error, 'Error');
    }).finally(() => {
      this.loadding = false;
        if(this.cust_phone_no !=null && this.cust_phone_no !=undefined && this.cust_phone_no !=''){
          (document.getElementById('sale_h_cust_phone_no') as HTMLInputElement).value=this.cust_phone_no;
        }else{
          this.cust_phone_no='';
          (document.getElementById('sale_h_cust_phone_no') as HTMLInputElement).value='';
        }
    });
  }

  SendDatatoSalePage(event) {
    this.router.navigate(['/pointofsale/enter-new-sale', {
      Holddata: this.encriptDecript.encrypt(event.sale_header_no),
      customer_id: this.encriptDecript.encrypt(event.cust_id),
      type: 'view'
    }]);
  }

  ReturnCreateOrder(event: SaleHistoryListModel) {
    if (event.qty == event.return_qty) {
      this._toster.error('This sale is already fully refunded', 'error');
    } else {
      try {
        const json = {
          parent_so_no: event.sale_header_no,
          email_id: this.sessionManageMent.getEmail,
          store_id: this.sessionManageMent.getLocationId,
        }
        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.refundItem, json)
          .then(result => {
            if (result != null && result.length > 0 && result[0].condition.toLowerCase() == 'true') {
              this.router.navigate(['/pointofsale/sale_history/return-sale',
                {
                  result: this.encriptDecript.encrypt(JSON.stringify(result)),
                  eventdata: this.encriptDecript.encrypt(JSON.stringify(event))
                }])
            } else {
              this._toster.error(result.length > 0 ? result[0].message : "Response is not proper.", "Error");
            }
          }, error => {
            console.log(error)
          })
      } catch (e) {
        console.log(e);
      }
    }
  }

  clickOnRow(sale_header_no: string) {
    var paggingData: PaggingModel = new PaggingModel();
    if (sale_header_no == null || sale_header_no == undefined || sale_header_no == '') {
      paggingData = this.sessionManageMent.getSaleHistoryPagging;
      if (paggingData == null || paggingData == undefined) {
        paggingData = new PaggingModel();
        paggingData.primary_value = sale_header_no
        paggingData.page_number = this.PageNumber;
      }
    } else {
      paggingData.primary_value = sale_header_no
      paggingData.page_number = this.PageNumber;
    }


    this.viewBrandDataSource.data.map(item => {
      if ((sale_header_no == item.sale_header_no || paggingData.primary_value == item.sale_header_no) && paggingData.page_number == this.PageNumber) {
        this.sessionManageMent.setSaleHistoryPagging({
          primary_value: paggingData.primary_value,
          page_number: paggingData.page_number
        });
        item.highlighted = true;
      } else
        item.highlighted = false
    });
  }
}

export class SaleHistoryListModel {
  condition: string;
  cust_details: string;
  cust_email_id: string;
  cust_id: string;
  cust_phone_no: string;
  discount: string;
  order_status: string;
  parent_so_no: string;
  pending_qty: string;
  qty: string;
  return_qty: string;
  sale_datetime: string;
  sale_header_no: string;
  store_id: string;
  sub_total: string;
  total_amount: string;
  attach_sale_person: string;
  invoice_no: string;
  total_amount_with_discount: 0
  total_discount: number;
  total_gst: number;
  total_rows:number;
  highlighted:boolean;
  hovered:boolean;
}

export class SaleHeaderHistoryDataModel {
  condition: string;
  sale_header: Array<{
    sale_header_no:string;
    cust_name: string;
    cust_email_id: string;
    cust_phone_no: string;
    cust_id: string;
    sale_person_id: string;
    store_id: string;
    sub_total: number;
    total_amount: number;
    round_off_amount:number;
    header_with_discount: string;
    remain_amount: string;
    return_or_exchange: string;
    order_status: string;
    document_type: string;
    sale_datetime: string;
    invoice_no: string;
    no_of_print: string;

    attach_sale_person: string;
    sale_person_name: string;
    sale_person_phone_no: string;
    total_discount: number;
    total_gst: number;

  }>;
  sale_line: Array<{
    sale_line_no: string;
    barcode: string;
    serial_no: string;
    qty: string;
    unit_price: string;
    discount_amt: number;
    gstpercentage: number;
    gstgroupcode: string;
    gstbaseamt: string;
    totalGstamt: string;
    amount: string;
    line_with_discount: string;
    return_qty: string;
    pending_return_qty: string;
    product_name: string;
    total_amount:number;
    image_url: string;
  }>;
  sale_payment: Array<{
    pay_type: string;
    amount: string;
    card_no: string;
    card_month: string;
    card_year: string;
    credit_note_no: string;
    created_on: string;
  }>
}


