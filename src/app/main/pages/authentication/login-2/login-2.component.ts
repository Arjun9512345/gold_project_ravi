import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {Login2Service} from "./login-2.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {pristineNavigationService} from "../../../../../@pristine/components/navigation/navigation.service";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {ValidateResponse} from "../../../../../@pristine/process/ValidateResponse";
import {SignalR} from "../../../../../@pristine/process/SignalR";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {ToastrService} from "ngx-toastr";
import {pristineAnimations} from "../../../../../@pristine/animations";
import {pristineConfigService} from "../../../../../@pristine/services/config.service";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {CustomerListModel} from "../../../pos_master/pos_customer/pos_customer.component";
import {MatDialog} from "@angular/material/dialog";


@Component({
  selector: 'login-2',
  templateUrl: './login-2.component.html',
  styleUrls: ['./login-2.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: pristineAnimations
})
export class Login2Component implements OnInit, OnDestroy {

  total_qty:number=0;
  total_weight:number=0;
  sub_total:number=0;
  total_gst:number=0;
  total_amount:number=0;

  autocomplete_itemList: Array<ProductListModel> = [];
  loadding: boolean = false;
  scan_by_user: boolean = false;
  sale_order_header_line_list: Array<SaleOrderListModel> = [];
  customer_list_data: Array<CustomerListModel> = [];
  selected_customer_name_byuser: string = null;
  selected_customer_phone_no_byuser: string = null;
  selected_customer_address_byuser:string=null;

  getRounded_Amount(amounnt: number): number {
    let round_value: number = (Math.round(amounnt) - amounnt);
    return round_value;
  }

  getTotal_Amount(amounnt: number): number {
    let round_value: number = Math.round(amounnt);
    return round_value;
  }

  @ViewChild('barcodeinputValue', {static: true}) barcodeinputValue: ElementRef;

  get verifyCustomer(): boolean {
    if (this.selected_customer_name_byuser == null || this.selected_customer_name_byuser == '')
      return false;
    else
      return true;
  }


  constructor(
    private _pristineConfigService: pristineConfigService,
    private _formBuilder: FormBuilder,
    private _toastr: ToastrService,
    private _sessionManageMent: SessionManageMent,
    private _validateResponse: ValidateResponse,
    private _router: Router,
    private _login2Service: Login2Service,
    private _snackBar: MatSnackBar,
    private  route: ActivatedRoute,
    private _pristineNavigationService: pristineNavigationService,
    private _signalR: SignalR,
    private encriptDecript: EncriptDecript,
    private _webapiHttp: WebApiHttp,
    private dialog: MatDialog
  ) {
    this.autocomplete_itemList=this.product_list;
    // Configure the layout
    this._pristineConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        toolbar: {
          hidden: false
        },
        footer: {
          hidden: true
        },
        sidepanel: {
          hidden: true
        }
      }
    };


  }

  /**
   * On init
   */
  ngOnInit(): void {

  }


  openSnackBar(message: string) {
    this._snackBar.open(message, 'Clear', {
      duration: 5000,
    });
  }

  ngOnDestroy(): void {
  }

  _filterItemAutoComplete(value: any): any {
    this.autocomplete_itemList = this.product_list.filter(value1 => {
      return value1.name.toString().toLowerCase().includes(value.toString().toLowerCase())
    });
  }
  sale_barcode_scan_by_user(selected_item:ProductListModel,scan_user_input_value:string){
    let selected_item_scan_filter:Array<ProductListModel> =[];
    if(selected_item!=null){
      selected_item_scan_filter= this.product_list.filter(value => {
        return value.name.toLowerCase()==selected_item.name.toLowerCase()
      });
    }
    if(scan_user_input_value!=null){
      selected_item_scan_filter=this.product_list.filter(value => {
        return value.name.toLowerCase()==scan_user_input_value.toLowerCase()
      });

      this.sale_order_header_line_list.findIndex(value => {
        return value.item_name.toLowerCase()==selected_item.name.toLowerCase();
      });

    }

    if(selected_item_scan_filter.length<=0){
      this._toastr.error("No Record Found.");
      return;
    }
   let sale_order_line_index:number= this.sale_order_header_line_list.findIndex(value => {
      return value.item_name.toLowerCase()==selected_item_scan_filter[0].name.toLowerCase();
    });

    if(sale_order_line_index<0){
      this.sale_order_header_line_list.push({
        item_name: selected_item_scan_filter[0].name,
        item_desc: selected_item_scan_filter[0].desc,
        item_mrp: 0,
        item_weight:0,
        item_gst_per: selected_item_scan_filter[0].gst_per,
        qty:1,
        line_sub_total:0,
        line_total_gst_amt:0,
        line_total_amount:0,
        selected_byuser:false
      });
    }else{

      this.sale_order_header_line_list[sale_order_line_index]={
        item_name: selected_item_scan_filter[0].name,
        item_desc: selected_item_scan_filter[0].desc,
        item_mrp: this.sale_order_header_line_list[sale_order_line_index].item_mrp,
        item_weight: this.sale_order_header_line_list[sale_order_line_index].item_weight,
        item_gst_per: selected_item_scan_filter[0].gst_per,
        qty:this.sale_order_header_line_list[sale_order_line_index].qty+=1,
        line_sub_total:0,
        line_total_gst_amt:0,
        line_total_amount:0,
        selected_byuser:false
      };
    }
    this.total_qty=0;
    this.total_weight=0;
    this.sub_total=0;
    this.total_gst=0;
    this.total_amount=0;
    this.sale_order_header_line_list.map(value => {

      value.line_sub_total=value.qty*value.item_mrp*value.item_weight;
      value.line_total_gst_amt=value.line_sub_total*value.item_gst_per/100;
      value.line_total_amount=value.line_sub_total+(value.line_sub_total*value.item_gst_per/100);

      this.total_qty+=value.qty;
      this.total_weight+=value.item_weight;
      this.sub_total+=value.line_sub_total;
      this.total_gst+=value.line_total_gst_amt;
      this.total_amount+=value.line_total_amount;
    });
    this._toastr.success("Item Added Successfully.")
  }

  userManualValueChange(){
    this.total_qty=0;
    this.total_weight=0;
    this.sub_total=0;
    this.total_gst=0;
    this.total_amount=0;
    this.sale_order_header_line_list.map(value => {

      value.line_sub_total=value.qty*value.item_mrp*value.item_weight;
      value.line_total_gst_amt=(value.line_sub_total*value.item_gst_per/100);
      value.line_total_amount=value.line_sub_total+(value.line_sub_total*value.item_gst_per/100);

      this.total_qty+=value.qty;
      this.total_weight+=value.item_weight;
      this.sub_total+=value.line_sub_total;
      this.total_gst+=value.line_total_gst_amt;
      this.total_amount+=value.line_total_amount;
    });
  }

  delete_ScanedBarcode(index:number) {
     this.sale_order_header_line_list.splice(index,1);
    this.total_qty=0;
    this.total_weight=0;
    this.sub_total=0;
    this.total_gst=0;
    this.total_amount=0;
    this.sale_order_header_line_list.map(value => {

      this.total_qty+=value.qty;
      this.total_weight+=value.item_weight;
      this.sub_total+=value.line_sub_total;
      this.total_gst+=value.line_total_gst_amt;
      this.total_amount+=value.line_total_amount;
    });
    this._toastr.success("Delete Successfully.")
  }

  selectCutomerAndSubmitHit(customer_name, customer_phone_no,customer_address) {
    this.selected_customer_name_byuser = customer_name;
    this.selected_customer_phone_no_byuser = customer_phone_no;
    this.selected_customer_address_byuser = customer_address;
  }

  discardSale() {
    this.selected_customer_phone_no_byuser = null;
    this.selected_customer_name_byuser = null;
    this.sale_order_header_line_list=[];
    this.total_qty=0;
    this.total_weight=0;
    this.sub_total=0;
    this.total_gst=0;
    this.total_amount=0;
  }

  product_list: Array<ProductListModel> = [
    {name: 'Gold', desc: 'Gold 24K', item_type: 'Gold', gst_per: 5},
    {name: 'Silver', desc: 'Silver 20g', item_type: 'Silver', gst_per: 5},
  ]
  @ViewChild('product_list_ui') product_list_ui!: TemplateRef<any>;

  productItemAddInsert() {
    var dialogRef = this.dialog.open(this.product_list_ui, {width: "500px"});
    dialogRef.afterClosed().subscribe(value => {
      window.location.reload();
    });
  }

  openCreatePaymentDialog() {
  }
}

export interface ProductListModel {
  name: string,
  desc: string,
  item_type: string,
  gst_per: number,
}

export interface SaleOrderListModel {
  item_name: string,
  item_desc: string,
  item_mrp: number,
  item_weight:number,
  item_gst_per: number,
  qty:number,
  line_sub_total:number,
  line_total_gst_amt:number,
  line_total_amount:number,
  selected_byuser:boolean
}
