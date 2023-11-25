import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {WebApiHttp} from '../../../../@pristine/process/WebApiHttp.services';
import {SessionManageMent} from '../../../../@pristine/process/SessionManageMent';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from "@angular/router";
import {EncriptDecript} from "../../../../@pristine/process/EncriptDecript";
import {isArray} from "rxjs/internal-compatibility";
import {pristineConfirmDialogComponent} from "../../../../@pristine/components/confirm-dialog/confirm-dialog.component";
import {CreatePayment_return_pageComponent} from "./create-payment_return_page/create-payment_return_page.component";
import {NgxSpinnerService} from "ngx-spinner";
import {BarcodeImageModel} from "../../pos_master/itemmanagement/itemlist/itemview/itemviewmodel";


@Component({
  selector: 'app-processSale',
  templateUrl: './processSaleReturn.component.html',
  styleUrls: ['./processSaleReturn.component.scss']
})
export class ProcessSaleReturnComponent implements OnInit {
  getRounded_Amount(amounnt:number):number{
    let round_value:number=(Math.round(amounnt)-amounnt);
    return round_value;
  }

  getTotal_Amount(amounnt:number):number{
    let round_value:number=Math.round(amounnt);
    return round_value;
  }
  autocomplete_itemList: Array<ItemListFilter> = [];
  loadding: boolean = false;

  constructor(public sessionManageMent: SessionManageMent,
              public webApiHttp: WebApiHttp,
              private _formBuilder: FormBuilder,
              private _toster: ToastrService,
              private router: Router,
              private encriptDecript: EncriptDecript,
              public activateRoute: ActivatedRoute,
              public  ngxSpinnerService: NgxSpinnerService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    var data = JSON.parse(this.encriptDecript.decrypt(this.activateRoute.snapshot.paramMap.get('result')))
    this.sale_order_header_line_list = data;
    this.GetReturnOrderHeader();

  }

  GetReturnOrderHeader() {
    this.loadding = true;
    var json = {
      so_no:this.sale_order_header_line_list[0].sale_header_no,
      email_id: this.sessionManageMent.getEmail,
      store_id: this.sessionManageMent.getLocationId
    };
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.getSaleRecord, json).then((result) => {
      var response: Array<SaleReturnOrderDetail> = result;
      if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
        this.sale_order_header_line_list = response;
      } else {
        this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
      }
    }).catch(error => {
      this._toster.error(error, 'Error');
    }).finally(() => {
      this.loadding = false;
      this.getImageUrl();
    });
  }


  _filterItemAutoComplete(value: any): any {
    this.loadding = true;
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.pos_search_product, {
      filter: value,
      store_id: this.sessionManageMent.getLocationId
    }).then(result => {
      var response: Array<ItemListFilter> = result;
      if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
        this.autocomplete_itemList = response;
      } else {
        // this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
      }
    }).catch(error => {
      // this._toster.error(error, 'Error');
    }).finally(() => {
      this.loadding = false;
    });
  }


  sale_order_header_line_list: Array<SaleReturnOrderDetail>=[];


  delete_ScanedBarcode(element: SaleReturnOrderDetail) {
    if(this.sale_order_header_line_list.length<=0 || this.sale_order_header_line_list[0].total_qty==1){
      this._toster.error('You Can Not Delete All Qty Of Return.','Error');
      return;
    }
    var dialogConfig = this.dialog.open(pristineConfirmDialogComponent)
    dialogConfig.componentInstance.confirmMessage = 'You want to delete ' + element.product_name + ' ( ' + element.barcode + ' ) item.';
    dialogConfig.afterClosed().subscribe(result => {
      if (result == true) {
        this.loadding = true;
        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.return_barcode_delete,
          {
            so_no: element.sale_header_no,
            barcode: element.barcode,
            email_id: this.sessionManageMent.getEmail,
            store_id: this.sessionManageMent.getLocationId
          }).then(result => {
          if (isArray(result)) {
            let response: Array<SaleReturnOrderDetail> = result;
            if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
              this._toster.success(response[0].message, "Success");
              this.sale_order_header_line_list = response;
            } else {
              this._toster.error(response.length > 0 ? response[0].message : "Response is not proper.", "Error");
            }
          } else this._toster.error(result.message, "Error");
        }).finally(() => {
          this.loadding = false;
        });
      }
    });

  }

  CancelReturnOrder(sale_header_no: string) {
    var dialogConfig = this.dialog.open(pristineConfirmDialogComponent)
    dialogConfig.componentInstance.confirmMessage = 'You want to Cancel Return Order No. (' + sale_header_no + ').';
    dialogConfig.afterClosed().subscribe(result => {
      if (result == true) {
        this.ngxSpinnerService.show();
        this.webApiHttp.Get(this.webApiHttp.ApiURLArray.delete_reurn_temp_sale_order_data + sale_header_no)
          .then(result => {
            if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
              this.router.navigateByUrl('pointofsale/sale_history',{ replaceUrl: true })
            } else {
              this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
            }
          }).finally(() => {
          this.ngxSpinnerService.hide();
        });

      }
    });

  }

  openCreatePaymentDialog() {
    const dialogRef = this.dialog.open(CreatePayment_return_pageComponent, {
      data: {
        flag: 'Sale Summary',
        sale_order_header_line_list: this.sale_order_header_line_list,
      }, width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result) {
        this.router.navigateByUrl('/pointofsale/sale_history',{ replaceUrl: true });
      }
    });
  }

  selectRowByUser(index: number) {
    for (let i = 0; i < this.sale_order_header_line_list.length; i++) {
      this.sale_order_header_line_list[i].selected_byuser = false;
    }
    this.sale_order_header_line_list[index].selected_byuser = true;
  }

  getImageUrl() {
    this.sale_order_header_line_list.map(async item => {
      await this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetImage + item.barcode).then((result: BarcodeImageModel) => {
        item.image_url = result.img1;
      })
    });
  }
}

export class SaleReturnOrderDetail {
  condition: string;
  message: string;
  image_url: string;
  product_name: string;
  sale_header_no: string;
  cust_name: string;
  cust_phone_no:string;
  cust_id: string;
  created_by: string;
  store_id: string;
  total_qty: number;
  sub_total: number;
  total_discount: number;
  total_gst: number;
  total_amount: number;
  total_amount_with_discount: number;
  remain_amount: number;
  return_or_exchange: number;
  order_status: string;
  sale_datetime: string;
  sale_line_no: number;
  item_no: string;
  barcode: string;
  qty: number;
  unit_price: number;
  line_sub_total: number;
  inclusive_tax: number;
  exclusive_tax: number;
  line_discount_amt: number;
  gstpercentage: number;
  gstgroupcode: string;
  gstbaseamt: number;
  line_total_gst_amt: number;
  line_total_amount: number;
  return_qty: number;
  pending_return_qty: number;
  selected_byuser: boolean;
  attach_sale_person:string;

  parent_so_no:string;
}

export class ItemListFilter {
  barcode: string;
  condition: string;
  image_url: string;
  product_name: string;
  retail_cost: string;
}


