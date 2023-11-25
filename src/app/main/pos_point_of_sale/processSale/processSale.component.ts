import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {WebApiHttp} from '../../../../@pristine/process/WebApiHttp.services';
import {SessionManageMent} from '../../../../@pristine/process/SessionManageMent';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {EncriptDecript} from "../../../../@pristine/process/EncriptDecript";
import {isArray} from "rxjs/internal-compatibility";
import {pristineConfirmDialogComponent} from "../../../../@pristine/components/confirm-dialog/confirm-dialog.component";
import {CustomerListModel} from "../../pos_master/pos_customer/pos_customer.component";
import {CreatePos_customerComponent} from "../../pos_master/pos_customer/create-pos_customer/create-pos_customer.component";
import {CreatePayment_pageComponent} from "./create-payment_page/create-payment_page.component";
import {Item_qty_price_changeComponent} from "./item_qty_price_change/item_qty_price_change.component";
import {SalePersonMasterListModel} from '../../pos_master/pos-sale-person/pos-sale-person.component';
import {NgxSpinnerService} from "ngx-spinner";
import {BarcodeImageModel} from "../../pos_master/itemmanagement/itemlist/itemview/itemviewmodel";
import {Customer_history_itemsComponent} from "./customer_history_items/customer_history_items.component";

@Component({
  selector: 'app-processSale',
  templateUrl: './processSale.component.html',
  styleUrls: ['./processSale.component.scss']
})
export class ProcessSaleComponent implements OnInit, AfterViewInit, OnDestroy {
  autocomplete_itemList: Array<ItemListFilter> = [];
  loadding: boolean = false;
  subscription: any;
  scan_by_user: boolean = false;


  getRounded_Amount(amounnt:number):number{
    let round_value:number=(Math.round(amounnt)-amounnt);
    return round_value;
  }
  getTotal_Amount(amounnt:number):number{
    let round_value:number=Math.round(amounnt);
    return round_value;
  }

  @ViewChild('barcodeinputValue', {static: true}) barcodeinputValue: ElementRef;

  get verifyCustomer():boolean{
    if( this.sale_order_header_line_list && this.sale_order_header_line_list.length>0 && (this.sale_order_header_line_list[0].cust_id==null||this.sale_order_header_line_list[0].cust_id==undefined||this.sale_order_header_line_list[0].cust_id==''))
      return false;
    else  if(this.sale_order_header_line_list && this.sale_order_header_line_list.length>0 && this.sale_order_header_line_list[0].cust_id!=null && this.sale_order_header_line_list[0].cust_id!=undefined && this.sale_order_header_line_list[0].cust_id!='')
      return true;
    else
      return false;
  }
  get verifySalePerson():boolean{
    if(this.sale_order_header_line_list.length>0 && (this.sale_order_header_line_list[0].attach_sale_person==null||this.sale_order_header_line_list[0].attach_sale_person==undefined||this.sale_order_header_line_list[0].attach_sale_person==''))
      return false;
    else  if(this.sale_order_header_line_list.length>0 && this.sale_order_header_line_list[0].attach_sale_person!=null && this.sale_order_header_line_list[0].attach_sale_person!=undefined && this.sale_order_header_line_list[0].attach_sale_person!='')
      return true;
    else
      return false;
  }
  constructor(public sessionManageMent: SessionManageMent,
              public webApiHttp: WebApiHttp,
              private _formBuilder: FormBuilder,
              private _toster: ToastrService,
              private router: Router,
              private ngxSpinnerService: NgxSpinnerService,
              private encriptDecript: EncriptDecript,
              public activateRoute: ActivatedRoute,
              private dialog: MatDialog) {
    this.subscription = router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.type = this.activateRoute.snapshot.paramMap.get('type')
        if (this.type != null && this.type.toLowerCase() == 'view') {
          let so_no: string = this.encriptDecript.decrypt(this.activateRoute.snapshot.paramMap.get('Holddata'));
          this.CheckOpenSaleList(so_no);
        } else {
          this.CheckOpenSaleList();
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  selectCutomerAndSubmitHit() {
    if (this.temp_selected_customer_byuser == null ||this.temp_selected_customer_byuser==undefined || this.temp_selected_customer_byuser?.cust_id == null ||this.temp_selected_customer_byuser?.cust_id == undefined || this.temp_selected_customer_byuser?.cust_id == '') {
      this._toster.error('Please Add Customer First Then Select Customer.', 'Error');
      return;
    }
    if(this.sale_order_header_line_list==null || this.sale_order_header_line_list.length<=0
      || this.sale_order_header_line_list[0].sale_header_no==null
      ||this.sale_order_header_line_list[0].sale_header_no==undefined
    ||this.sale_order_header_line_list[0].sale_header_no==''){
      this._toster.error('Sale Order Number Not Found.', 'Error');
      return;
    }
    this.ngxSpinnerService.show();
    var json={
      flag:'Update Customer',
      cust_id:this.temp_selected_customer_byuser.cust_id,
      sale_header_no:this.sale_order_header_line_list[0].sale_header_no,
      email_id:this.sessionManageMent.getEmail,
      store_id:this.sessionManageMent.getLocationId
    };
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.UpdateCustomerOnSaleHeader ,json).then(result => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        this.temp_selected_customer_byuser = null;
        this.sale_order_header_line_list=result;
      } else {
        this._toster.error(result.length>0?result[0].message:result.message,'Error');
        this.temp_selected_customer_byuser = null;
      }
    }).catch(err=>{
      this._toster.error(err.message,'Error');
    }).finally(() => {

      this.ngxSpinnerService.hide();
    });
  }

  selectSalePersonAndSubmitHit() {
    if(!this.verifyCustomer)
    {
      this._toster.error('Please Add Customer First Then Select Customer.','Error');
      return;
    }
    if (this.temp_selected_sale_person == null ||this.temp_selected_sale_person == undefined ||this.temp_selected_sale_person?.code == null||this.temp_selected_sale_person?.code == undefined||this.temp_selected_sale_person?.code == '') {
      this._toster.error('Please Select Sale Person.', 'Error');
      return;
    }
    this.ngxSpinnerService.show();
    var json={
      flag:'Update SalePerson',
      cust_id:this.temp_selected_sale_person.code,
      sale_header_no:this.sale_order_header_line_list[0].sale_header_no,
      email_id:this.sessionManageMent.getEmail,
      store_id:this.sessionManageMent.getLocationId
    };
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.UpdateCustomerOnSaleHeader ,json).then(result => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        this.temp_selected_sale_person = null;
        this.sale_order_header_line_list=result;
      } else {
        this.temp_selected_sale_person = null;
        this._toster.error(result.length>0?result[0].message:result.message,'Error');
      }
    }).catch(err=>{
      this._toster.error(err.message,'Error');
    }).finally(() => {
      this.loadding = false;
      this.ngxSpinnerService.hide();
    });
  }

  type: string = '';

  ngOnInit(): void {
    //window.open('PristinePOSAlert:PristinePOS');
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
        this.getProductImageUrl();
      } else {
        // this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
      }
    }).catch(error => {
      // this._toster.error(error, 'Error');
    }).finally(() => {
      this.loadding = false;
    });
  }

  customer_list_data: Array<CustomerListModel> = [];
  temp_selected_customer_byuser: CustomerListModel;

  sale_person_list_data: Array<SalePersonMasterListModel> = [];
  temp_selected_sale_person: SalePersonMasterListModel;

  _filterCustomerAutoComplete(value: string) {
    this.loadding = true;
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.pos_find_customer, {
      filter: value
    }).then(result => {
      var response: Array<CustomerListModel> = result;
      if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
        this.customer_list_data = response;
      } else {
        this.customer_list_data = [];
        //this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
      }
    }).catch(error => {
      // this._toster.error(error, 'Error');
    }).finally(() => {
      this.loadding = false;
    });
  }

  _filterSalePersonAutoComplete(value: string) {
    this.loadding = true;
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.pos_find_saleperson, {
      filter: value,
      location_id:this.sessionManageMent.getLocationId
    }).then(result => {
      var response: Array<SalePersonMasterListModel> = result;
      if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
        this.sale_person_list_data = response;
      } else {
        this.sale_person_list_data = [];
        //this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
      }
    }).catch(error => {
      // this._toster.error(error, 'Error');
    }).finally(() => {
      this.loadding = false;
    });
  }


  sale_apply_coupon(coupon_code: string) {
    if(this.sale_order_header_line_list==null || this.sale_order_header_line_list.length<=0
      || this.sale_order_header_line_list[0].sale_header_no==null
      ||this.sale_order_header_line_list[0].sale_header_no==undefined
      ||this.sale_order_header_line_list[0].sale_header_no==''){
      this._toster.error('Sale Order Number Not Found.', 'Error');
      return;
    }
    this.ngxSpinnerService.show();
    let item_list:Array<{sku:string,qty:number}>=[];
    this.sale_order_header_line_list.forEach(item=>{
      if(item.item_no==null||item.item_no==undefined||item.item_no=='')
        return;
      item_list.push({sku:item.item_no,qty:item.qty})
    })
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.sale_apply_coupon_scan, {
      manualInvoiceNumber: this.sale_order_header_line_list[0].sale_header_no,
      couponCode: coupon_code,
      email_id: this.sessionManageMent.getEmail,
      store_id: this.sessionManageMent.getLocationId,
      childId:item_list
    }).then(response => {
      if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
        this.barcodeinputValue.nativeElement.value = '';
        this.sale_order_header_line_list = response;
        this.getImageUrl();
        if(coupon_code!=''){
          if(this.sale_order_header_line_list[0].coupon_code!=''){
            this._toster.success('Apply Coupon Successfully.', 'Success');
          }
          else
            this._toster.warning('Coupon Not Found.', 'Warning');
        }
        else
          this._toster.success('Remove Coupon Successfully.', 'Success');
      } else {
        this.barcodeinputValue.nativeElement.value='';
        this._toster.error(response.length > 0 ? response[0].message : response.message, 'Error');
      }
    }).catch(error => {
      this._toster.error(error.message, 'Error');
    }).finally(() => {
      this.ngxSpinnerService.hide();

    });

  }


  sale_barcode_scan_by_user(data: ItemListFilter, scaned_barcode: string = '') {
    if(this.sale_order_header_line_list==null || this.sale_order_header_line_list.length<=0
      || this.sale_order_header_line_list[0].sale_header_no==null
      ||this.sale_order_header_line_list[0].sale_header_no==undefined
      ||this.sale_order_header_line_list[0].sale_header_no==''){
      this._toster.error('Sale Order Number Not Found.', 'Error');
      return;
    }

    if (!this.verifyCustomer){
      this._toster.error('Please attach the customer', 'Error');
      return;
    }

    if(!this.verifySalePerson){
      this._toster.error('Please attach the sales person', 'Error');
      return;
    }

    this.ngxSpinnerService.show();
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.pos_sale_barcode_scan, {
      so_no: this.sale_order_header_line_list[0].sale_header_no,
      barcode: data != null ? data.barcode : scaned_barcode,
      qty: 1,
      email_id: this.sessionManageMent.getEmail,
      store_id: this.sessionManageMent.getLocationId
    }).then(response => {

        if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
          this.barcodeinputValue.nativeElement.value = '';
          this.sale_order_header_line_list = response;
          this.getImageUrl();
          this._toster.success('Barcode Scan Success.', 'Success');
        } else {
          this.barcodeinputValue.nativeElement.value='';
          this._toster.error(response.length > 0 ? response[0].message : response.message, 'Error');
        }
    }).catch(error => {
      this._toster.error(error.message, 'Error');
    }).finally(() => {
      this.ngxSpinnerService.hide();

    });

  }


  sale_order_header_line_list: Array<SaleOrderDetail>=[];

  CheckOpenSaleList(sono: string = null) {
    this.ngxSpinnerService.show();
    var json = {
      email_id: this.sessionManageMent.getEmail,
      store_id: this.sessionManageMent.getLocationId,
      so_no: sono
    };
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.pos_check_open_sale, json).then(response => {
      if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
        this.sale_order_header_line_list = response;
        console.log(sono,this.sale_order_header_line_list[0].sale_header_no)
        if(sono!=null && sono!=undefined && sono!='' && sono!=this.sale_order_header_line_list[0].sale_header_no){
          this.router.navigateByUrl('/pointofsale/enter-new-sale',{ replaceUrl: true });
        }
        this.getImageUrl();
      } else {
        if(sono!=null && sono!=undefined && sono!='' && response.length>0 && response[0].message.indexOf('Refress Ui')>0){
          this.router.navigateByUrl('/pointofsale/enter-new-sale',{ replaceUrl: true });
        }
        this._toster.error(response.length > 0 ? response[0].message : response.message, 'Error');
      }

    }).catch(error => {
      this._toster.error(error, 'Error');
    }).finally(() => {
      this.ngxSpinnerService.hide();
    });
  }


  delete_ScanedBarcode(element: SaleOrderDetail) {
    var dialogConfig = this.dialog.open(pristineConfirmDialogComponent)
    dialogConfig.componentInstance.confirmMessage = 'You want to delete ' + element.product_name + ' ( ' + element.barcode + ' ) item.';
    dialogConfig.afterClosed().subscribe(result => {
      if (result == true) {
        this.ngxSpinnerService.show();
        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.pos_sale_barcode_delete,
          {
            so_no: element.sale_header_no,
            barcode: element.barcode,
            qty: 1,
            email_id: this.sessionManageMent.getEmail,
            store_id: this.sessionManageMent.getLocationId
          }).then(response => {

            if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
              this.sale_order_header_line_list = response;
              this.getImageUrl();
              this._toster.success('Item barcode Delete Successfully.', "Success");
            } else {
              this._toster.error(response.length > 0 ? response[0].message : response.message, 'Error');
            }

        }).finally(() => {
          this.ngxSpinnerService.hide();
        });
      }
    })

  }

  openCustomerMasterDialog(values:any) {
    if(this.sale_order_header_line_list==null || this.sale_order_header_line_list.length<=0
      || this.sale_order_header_line_list[0].sale_header_no==null
      ||this.sale_order_header_line_list[0].sale_header_no==undefined
      ||this.sale_order_header_line_list[0].sale_header_no==''){
      this._toster.error('Sale Order Number Not Found.', 'Error');
      return;
    }
    const dialogRef = this.dialog.open(CreatePos_customerComponent, {
      data: {
        flag: 'Add Customer',
        values:values,
        dailogOpen: true,
        customerData: null
      }, width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let response: Array<CustomerListModel> = result;
        if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
          // this._toster.success(response[0].message, "Success");
          this.temp_selected_customer_byuser = response[0];
          this.selectCutomerAndSubmitHit();

        } else {
          this._toster.error(response.length > 0 ? response[0].message : "Response is not proper.", "Error");
        }
      }
    });
  }
  openCustomerHistoryDialog() {
    const dialogRef = this.dialog.open(Customer_history_itemsComponent, {
      data: {
        flag: 'Customer History',
        customer_id:this.sale_order_header_line_list[0].cust_id,
        cust_name:this.sale_order_header_line_list[0].cust_name,
        cust_mobile_no:this.sale_order_header_line_list[0].cust_mobile_no,
      }, width: '600px'
    });
  }


  openCreatePaymentDialog() {
    if(this.sale_order_header_line_list==null || this.sale_order_header_line_list.length<=0
      || this.sale_order_header_line_list[0].sale_header_no==null
      ||this.sale_order_header_line_list[0].sale_header_no==undefined
      ||this.sale_order_header_line_list[0].sale_header_no==''){
      this._toster.error('Sale Order Number Not Found.', 'Error');
      return;
    }
    if (this.sale_order_header_line_list.length>0 && (this.sale_order_header_line_list[0].cust_id == ''||this.sale_order_header_line_list[0].cust_id == null||this.sale_order_header_line_list[0].cust_id == undefined)) {
      this._toster.error('Please Select Customer.', 'Error');
      return;
    }


    const dialogRef = this.dialog.open(CreatePayment_pageComponent, {
      data: {
        flag: 'Sale Summary',
        sale_data: this.sale_order_header_line_list[0]
      }, width: '950px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.temp_selected_customer_byuser = null;
        this.temp_selected_sale_person = null;
        this.sale_order_header_line_list = [];
        this.router.navigateByUrl('/pointofsale/enter-new-sale',{ replaceUrl: true });
        this.CheckOpenSaleList();
      }
    });
  }

  selectRowByUser(index: number) {
    for (let i = 0; i < this.sale_order_header_line_list.length; i++) {
      this.sale_order_header_line_list[i].selected_byuser = false;
    }
    this.sale_order_header_line_list[index].selected_byuser = true;
  }

  openImageDeatil(index: number) {
    const dialogRef = this.dialog.open(Item_qty_price_changeComponent, {
      data: {
        flag: 'Scanned Item Summary',
        sale_order_header_line_list: this.sale_order_header_line_list[index]
      }, width: '800px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.temp_selected_customer_byuser = null;
        this.temp_selected_customer_byuser = null;
        this.sale_order_header_line_list = [];
        let so_no = null;
        try {
          this.type = this.activateRoute.snapshot.paramMap.get('type')
          if (this.type != null && this.type.toLowerCase() == 'view') {
            so_no = this.encriptDecript.decrypt(this.activateRoute.snapshot.paramMap.get('Holddata'));
            this.CheckOpenSaleList(so_no);
          } else {
            this.CheckOpenSaleList();
          }
        } catch (e) {
          this.CheckOpenSaleList();
        }

      }
    });
  }

  discard_or_parkSale(type: string) {
    if(this.sale_order_header_line_list==null || this.sale_order_header_line_list.length<=0
      || this.sale_order_header_line_list[0].sale_header_no==null
      ||this.sale_order_header_line_list[0].sale_header_no==undefined
      ||this.sale_order_header_line_list[0].sale_header_no==''){
      this._toster.error('Sale Order Number Not Found.', 'Error');
      return;
    }
    var dialogConfig = this.dialog.open(pristineConfirmDialogComponent)
    dialogConfig.componentInstance.confirmMessage = 'You want to ' + type + ' ' + this.sale_order_header_line_list[0].sale_header_no + ' Order.';
    dialogConfig.afterClosed().subscribe(result => {
      if (result == true) {
        this.loadding = true;
        this.webApiHttp.Post(this.webApiHttp.ApiURLArray.pos_discard_or_park,
          {
            so_no: this.sale_order_header_line_list[0].sale_header_no,
            barcode: type
          }).then(result => {
          if (isArray(result)) {
            let response: Array<SaleOrderDetail> = result;
            if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
              this._toster.success(response[0].message, "Success");
              this.temp_selected_customer_byuser = null;
              this.temp_selected_customer_byuser = null;
              this.sale_order_header_line_list = [];
              this.router.navigateByUrl('/pointofsale/enter-new-sale',{ replaceUrl: true });
              this.CheckOpenSaleList();
            } else {
              this._toster.error(response.length > 0 ? response[0].message : "Response is not proper.", "Error");
            }
          } else this._toster.error(result.message, "Error");
        }).finally(() => {
          this.loadding = false;
        });
      }
    })

  }


  ngAfterViewInit(): void {
    this.barcodeinputValue.nativeElement.focus();
  }

  getImageUrl(){
      this.sale_order_header_line_list.map(async item=>{
        await this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetImage+item.barcode).then((result:BarcodeImageModel)=>{
          item.image_data= result;
          item.image_url=result.img1;
         })
      });
  }
  getProductImageUrl(){
    this.autocomplete_itemList.map(async item=>{
      await this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetImage+item.barcode).then((result:BarcodeImageModel)=>{
        item.image_url=result.img1;
      })
    });
  }


  CheckBalance(){
    this.ngxSpinnerService.show();
    var json = {
      flag: 'CheckBalance',
      storeId: this.sessionManageMent.getLocationId,
      mobileNo:this.sale_order_header_line_list[0].cust_mobile_no,
      sale_header_no:this.sale_order_header_line_list[0].sale_header_no
    };
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.pos_SaleCashbackSync, json).then(response => {
      if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
        this.sale_order_header_line_list = response;
        this._toster.success( response[0].message , 'Success');
        this.getImageUrl();
      } else {
        this._toster.error(response.length > 0 ? response[0].message : response.message, 'Error');
      }
    }).catch(error => {
      this._toster.error(error, 'Error');
    }).finally(() => {
      this.ngxSpinnerService.hide();
    });
  }
  ApplyBalance(redeem_amount,redeem_otp){
    this.ngxSpinnerService.show();
    var json = {
      flag: 'RedeemBalance',
      storeId: this.sessionManageMent.getLocationId,
      mobileNo:this.sale_order_header_line_list[0].cust_mobile_no,
      sale_header_no:this.sale_order_header_line_list[0].sale_header_no,
      otpCode:redeem_otp,
      redeemAmount:redeem_amount
    };
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.pos_SaleCashbackSync, json).then(response => {
      if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
        this.sale_order_header_line_list = response;
        this.CheckBalance();
        this._toster.success( response[0].message , 'Success');
      } else {
        this._toster.error(response.length > 0 ? response[0].message : response.message, 'Error');
      }
    }).catch(error => {
      this._toster.error(error, 'Error');
    }).finally(() => {
      this.ngxSpinnerService.hide();

    });
  }
  DiscardBalance(){
    this.ngxSpinnerService.show();
    var json = {
      flag: 'DiscardRedeem',
      storeId: this.sessionManageMent.getLocationId,
      mobileNo:this.sale_order_header_line_list[0].cust_mobile_no,
      sale_header_no:this.sale_order_header_line_list[0].sale_header_no,
      redeemAmount:this.sale_order_header_line_list[0].cashback_apply_amount,
      cbApprovalID:this.sale_order_header_line_list[0].cashback_CBApprovalID,
    };
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.pos_SaleCashbackSync, json).then(response => {
      if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
        this.sale_order_header_line_list = response;
        this.getImageUrl();
        this._toster.success( response[0].message , 'Success');
      } else {
        this._toster.error(response.length > 0 ? response[0].message : response.message, 'Error');
      }
    }).catch(error => {
      this._toster.error(error, 'Error');
    }).finally(() => {
      this.ngxSpinnerService.hide();

    });
  }
}

export class SaleOrderDetail {
  condition: string;
  message:string;
  document_type: string;
  sale_header_no: string;
  cust_name: string;
  cust_mobile_no:string;
  cust_id: string;
  created_by: string;
  store_id: string;
  total_qty: number;
  sub_total: number;
  total_discount: number;
  total_gst: number;
  total_amount_with_discount: number;
  total_amount_dis_gst: number;
  total_amount: number;
  remain_amount: number;
  return_or_exchange: number;
  order_status: string;
  sale_datetime: string;
  sale_post_datetime: string;
  invoice_no: string;
  terminal_id: string;
  no_of_print: number;
  attach_sale_person: string;
  sale_person_paid: number;
  sale_person_name:string;
  sale_person_phone_no:string;
  product_name: string;
  sale_line_no: string;
  item_no: string;
  barcode: string;
  qty: number;
  unit_price: number;
  line_sub_total: number;
  inclusive_tax: number;
  exclusive_tax: number;
  discount_percentage: number;
  line_discount_amt: number;
  gstgroupcode: string;
  gstpercentage: number;
  line_gstbaseamt: number;
  line_total_gst_amt: number;
  line_total_amount_with_discount: number;
  line_total_amount_dis_gst: number;
  line_total_amount: number;
  return_qty: number;
  return_pending_qty: number;
  apply_gst_type: number;

  //extra field
  selected_byuser:boolean;

  image_url:string;
  image_data:BarcodeImageModel;

  mrp:number;
  saving_amt:number;
  total_saving_on_mrp:number;
  coupon_code:string;
  coupon_amount:number;

  //cash back response

  cashback_balance:number;
  cashback_CBApprovalID:string;
  cashback_apply_amount:number;
  cashback_apply_on:string;
}

export class ItemListFilter {
  barcode: string;
  condition: string;
  image_url: string;
  product_name: string;
  item_no: string;
  unit_price: string;
}



