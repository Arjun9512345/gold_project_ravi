import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import * as data from '../../assets/static.json';
import {SessionManageMent} from "./SessionManageMent";
import {SignalR} from "./SignalR";

@Injectable({
  providedIn: 'root'
})

export class WebApiHttp {

  public globalurl: string = data.url_zivame_reliance;

  public ApiURLArray: any = {
    // User URL Start
    login: '/api/User/Login',
    Logout: '/api/User/Logout',
    createUser: '/api/User/CreateUser',
    roleProcess: '/api/Role/RoleProcess',
    signalRNotification: '/Notification',
    locationlist: '/api/User/LocationList',
    LoginWindowsByToken: '/api/User/LoginWindowsByToken',
    // User URL End

    //cluster management
    InsertClusterMaster: '/api/ClusterMaster/InsertClusterMaster',


    // Item URL start

    GetImage: '/api/Item/GetImage?barcode=',
    ItemList: '/api/Item/ItemList',
    ItemCategoryList: '/api/Item/ItemCategoryList',
    ItemCategoryCreate: '/api/Item/ItemCategoryCreate',
    ItemSubCategoryList: '/api/Item/ItemSubCategoryList?code=',
    ItemCategoryDelete: '/api/Item/ItemCategoryDelete',
    ItemFullInfo: '/api/Item/ItemFullInfo',

    // Item URL end


    // Lager URL start

    ItemLedgerList: '/api/Item/ItemLedgerList',
    ExcelItemLedgerList: '/api/Item/ExcelItemLedgerList?location_id=',

    // Lager URL end



    // dashboard
    pos_dash_sale_amount: '/pos/api/Dashboard/dash_sale_amount/',
    pos_dash_weekly_sale_amount: '/pos/api/Dashboard/dash_weekly_sale_amount/',
    dash_sale_amount_data_from_to:'/pos/api/Dashboard/dash_sale_amount_data_from_to',
    // Setup

    RoleMasterProcess: '/api/Role/RoleProcess',
    RolePermissionDetail: '/api/Role/RolePermissionDetail/',
    RolePermissionUpdate: '/api/Role/RolePermissionUpdate',

    // UserSetup

    GetAllUser: '/api/User/allUser',
    CreateUser: '/api/User/createUser',
    UpdateUser: '/api/User/updateUser',
    UpdateUserPassword: '/api/User/UpdatePassword',
    AddPrinterIPaddress: '/api/User/AddIPandPort',


//transfer order
    InboundList: '/api/TransferOrder/InboundList',
    AddNewItem: '/api/TransferOrder/ScanBarcodeSerialByUser',
    deleteBarcodeSerialByUser: '/api/TransferOrder/deleteBarcodeSerialByUser',
    DiscardTransferOrderDocument: '/api/TransferOrder/DiscardTransferOrderDocument',
    TransferOrderNavInsert: '/api/TransferOrder/TransferOrderNavInsert',
    NewTransferOrderHeader: '/api/TransferOrder/NewTransferOrderHeader',
    CompleteTransfer: '/api/TransferOrder/Complete',
    TransferOrderReport: '/api/TransferOrder/TransferOrderReport?transfer_no=',
    TransferOrderInfo: '/api/TransferOrder/TransferOrderInfo',
    TansferOrderReceivedScanBarcode: '/api/TransferOrder/TansferOrderReceivedScanBarcode',
    TansferOrderReceivedComplete: '/api/TransferOrder/TansferOrderReceivedComplete',
//end

    //todo einvoice work
    einvoice_generateIRN: '/api/Einvoice/generateIRN',
    einvoice_CancelIRN: '/api/Einvoice/CancelIRN',
    einvoice_generateEWayBill: '/api/Einvoice/generateEWayBill',
    einvoice_CancelEWayBill: '/api/Einvoice/CancelEWayBill',
    einvoice_GetEinvoiceReport: '/api/Einvoice/GetEinvoiceReport?document_no=',
    einvoice_GetTranspoter: '/api/Einvoice/GetTranspoter',
    HSNWiseReport: '/api/Einvoice/HSNWiseReport?document_no=',

    //Reports
    sale_category_report:'/api/Reports/sale_category_report',
    sale_dashboard:'/api/Reports/sale_dashboard',
    customer_wise_report:'/api/Reports/customer_wise_report',
    sale_person_wise_report:'/api/Reports/sale_person_wise_report',
    detailed_sale_report:'/api/Reports/detailed_sale_report',
    get_sale_person_payment_report:'/api/Reports/get_sale_person_payment_report',
    pos_get_store_Wise_Sale_Report :'/api/Reports/pos_get_store_Wise_Sale_Report',
    get_sale_category_contribution_report:'/api/Reports/pos_get_Category_Wise_Report',
    get_store_inventory_report:'/api/Reports/pos_get_Inventory_Report?store_id=',
    transfer_order_detail_report:'/api/Reports/transfer_order_report',
    credit_note_report:'/api/Reports/credit_note_report',
    adjustment_detail_report:'/api/Reports/adjustment_report',
    cycle_count_report:'/api/Reports/cycle_count_report',
    //adjustment

    DocumentList: '/api/ItemAdjustment/DocumentList',
    DocumentCreate: '/api/ItemAdjustment/DocumentCreate',
    DocumentView: '/api/ItemAdjustment/DocumentView',
    AdjustmentWithoutScan: '/api/ItemAdjustment/AdjustmentWithoutScan',
    AdjustmentWithUpload: '/api/ItemAdjustment/AdjustmentWithUpload',
    DeleteLine: '/api/ItemAdjustment/DeleteLine',
    AdjustmentComplete: '/api/ItemAdjustment/Complete',
    ApprovalComplete: '/api/ItemAdjustment/ApprovalComplete',


    //todo POS Apis
    //product
    pos_all_brand: '/pos/api/Brand/all_brand',
    pos_create_Brand: '/pos/api/Brand/create_Brand',
    pos_delete_Brand: '/pos/api/Brand/delete_Brand',
    //end
    //cusstomer
    pos_all_customer: '/pos/api/Customer/all_customer',
    pos_new_customer: '/pos/api/Customer/new_customer',
    pos_find_customer: '/pos/api/Customer/find_customer',
    pos_get_customer_cust_id: '/pos/api/Customer/get_customer_cust_id/',
    GetCustomerHistory: '/pos/api/Customer/GetCustomerHistory?customer_id=',

    //sale process
    getSalePrice:'/pos/api/Sale/getprice',
    pos_check_open_sale: '/pos/api/Sale/check_open_sale',
    pos_search_product: '/pos/api/Sale/search_product',
    UpdateCustomerOnSaleHeader: '/pos/api/Sale/UpdateCustomerOnSaleHeader',
    pos_sale_barcode_scan: '/pos/api/Sale/sale_barcode_scan',
    pos_SaleCashbackSync: '/pos/api/Sale/SaleCashbackSync',
    sale_apply_coupon_scan: '/pos/api/Sale/sale_apply_coupon_scan',
    pos_sale_barcode_delete: '/pos/api/Sale/sale_barcode_delete',
    pos_sale_order_post: '/pos/api/Sale/order_post',
    pos_discard_or_park: '/pos/api/Sale/discard_or_park',
    get_all_invoice_sale_ho: '/pos/api/Sale/get_all_invoice_sale_ho',
    get_sale_order_for_hold: '/pos/api/Sale/get_sale_order_for_hold',
    sale_line_price_discount_change: '/pos/api/Sale/sale_line_price_discount_change',
    SaleInvoiceReport: '/pos/api/sale/SaleInvoiceReport?invoice_no=',
    ReturnInvoiceReport: '/pos/api/Return/ReturnInvoiceReport?return_invoice_no=',
    get_sale_person_detail: '/pos/api/SalePerson/get_sale_person_detail?location_id=',
    sale_person_create: '/pos/api/SalePerson/sale_person_create',
    sale_person_payment: '/pos/api/sale/sale_person_payment',
    get_sale_person_commission_by_date: '/pos/api/sale/get_sale_person_commission_by_date',
    pos_find_saleperson: '/pos/api/SalePerson/find_saleperson',
    get_search_CreditNotDetail:'/pos/api/sale/get_search_CreditNotDetail',
    search_open_gift_card: '/pos/api/sale/search_open_gift_card',
    Sale_get_CreditNotDetail: '/pos/api/Sale/get_CreditNotDetail',
    GetAllSaleRange: '/pos/api/Sale/GetAllSaleRange',


    //return order
    return_barcode_delete: '/pos/api/Return/return_barcode_delete',
    delete_reurn_temp_sale_order_data: '/pos/api/Return/delete_reurn_temp_sale_order_data?sale_order_no=',
    pos_return_post: '/pos/api/Return/return_post',
    getSaleRecord: '/pos/api/Return/get_sale_return_order',
    refundItem: '/pos/api/Return/create_return_sale',
    pos_get_sale_details: '/pos/api/Sale/get_sale_details/',
    get_credit_note_header: '/pos/api/Return/get_credit_note_header',
    get_credit_note_detail: '/pos/api/Return/get_credit_note_detail/',
    pos_GetStoreLocationList: '/pos/api/LocationStore/GetStoreLocationList?type=',
    pos_InsertStoreLocationList: '/pos/api/LocationStore/InsertStoreLocationList',
    GetSyncProcessGetData: '/pos/api/LocationStore/GetSyncProcessGetData?flag=',
    NavPostSyncProcess: '/pos/api/LocationStore/PostSyncProcess',
    //price group
    pos_InsertUpdateSelectPriceGroup: '/pos/api/LocationStore/InsertUpdateSelectPriceGroup',
    pos_InsertUpdateSelectDeletePOSTerminalMaster: '/pos/api/LocationStore/InsertUpdateSelectDeletePOSTerminalMaster',
    InsertUpdatePOSPriceMaster: '/pos/api/LocationStore/InsertUpdatePOSPriceMaster',

    // end

    //todo state and district apis
    GetStateName: '/pos/api/LocationStore/GetStateName',
    GetDistrictName: '/pos/api/LocationStore/GetDistrictName?state_code=',


    //todo pos cycle count

    GetCycleCountHeader: '/pos/api/CycleCount/GetCycleCountHeader',
    ScanCycleCountItem: '/pos/api/CycleCount/ScanCycleCountItem',
    DeleteCycleCountItem: '/pos/api/CycleCount/DeleteCycleCountItem',
    GetItemInventoryList: '/pos/api/CycleCount/GetItemInventoryList?item_no=',
    CompleteCycleCountItem: '/pos/api/CycleCount/CompleteCycleCountItem',
    GetCycleCountList: '/pos/api/CycleCount/GetCycleCountList',
    ApproveGetCycleCountList: '/pos/api/CycleCount/ApproveGetCycleCountList',
    ApproveCycleCountBarcodeQtyChange: '/pos/api/CycleCount/ApproveCycleCountBarcodeQtyChange',
    ApproveCycleCountComplete: '/pos/api/CycleCount/ApproveCycleCountComplete',
    RejectCycleCountComplete: '/pos/api/CycleCount/RejectCycleCountComplete',
    DeleteCycleCountDocument: '/pos/api/CycleCount/DeleteCycleCountDocument',
    //todo end


    get_inventory_report : '/api/Reports/get_inventory_report',
    get_stock_inventory_report :'/api/Reports/get_pos_stock_ledger_report',
    get_storewise_inventory_report :'/api/Reports/get_pos_store_wise_inventory_report',
    get_item_without_store:'/pos/api/Sale/search_product_without_storeid',

    //todo day close
    StatementPostingGetDateRange : '/api/StatementPosting/StatementPostingGetDateRange',
    StatementCreateHeader :'/api/StatementPosting/StatementCreateHeader',
    StatementUpdateLineAmount :'/api/StatementPosting/StatementUpdateLineAmount',
    StatementPostingDiscardDocument :'/api/StatementPosting/StatementPostingDiscardDocument',
    StatementPostingReport :'/api/StatementPosting/StatementPostingReport',
  };

  constructor(private httpClient: HttpClient,
              private sessionManageMent:SessionManageMent,
              private _signalR: SignalR,
  ) {

  }

  //
  // get getHTTPHeader(): any {
  //   return {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json'
  //     })
  //   };
  // }

  get getHTTPHeader(): any {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization':this.sessionManageMent.getAuthToken
      })
    };
  }
  // getHTTPHeaderAuth(token: string): any {
  //   return {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer ' + token
  //     })
  //   };
  // }

  // post data to server
  async Post(path: string, jsondata: any): Promise<any> {
    try {
      path = this.globalurl + path;
      var headers = this.getHTTPHeader;
      return await new Promise<any>((resolve, reject) => {
        this.httpClient.post<any>(path, JSON.stringify(jsondata), headers).toPromise()
          .then(result => resolve(result), error => {
            if(error.status==401 && error.error.condition.toLowerCase()=="false"){
              this._signalR.stopSignalRConnection();
              localStorage.clear();
            }
            reject({
              condition: 'False',
              message: error.message
            })
          }).catch(err => reject({condition: 'False', message: err.message}));
      });

    } catch (e) {
      return new Promise<any>((resolve) => {
        resolve({condition: 'False', message: e.message})
      });
    }
  }

  // get data to the server
  async Get(path: string): Promise<any> {
    try {
      path = this.globalurl + path;
      var headers = this.getHTTPHeader;
      return await new Promise<any>((resolve, reject) => {
        this.httpClient.get<any>(path, headers).toPromise()
          .then(result => resolve(result), error => {
            if(error.status==401 && error.error.condition.toLowerCase()=="false"){
              this._signalR.stopSignalRConnection();
              localStorage.clear();
            }
            reject({
              condition: 'False',
              message: error.message
            })
          }).catch(err => reject({condition: 'False', message: err.message}));
      });
    } catch (e) {
      return new Promise<any>((resolve) => {
        resolve({condition: 'False', message: e.message})
      });
    }
  }


  getImageSrc(url: string) {
    try {
      if (url.includes('imageNotFound.png')) {
        return url;
      } else {
        return this.globalurl + '/' + url;
      }
    } catch (e) {
      return '';
    }
  }

  // For formdata
  async PostFormData(path: string, formdata: any): Promise<any> {
    try {
      path = this.globalurl + path;
      return await new Promise<any>((resolve, reject) => {
        this.httpClient.post<any>(path, formdata).toPromise()
          .then(result => resolve(result), error => reject({
            condition: 'false',
            message: error.message
          })).catch(error => reject({
          condition: 'false',
          message: error.message
        }))
      })

    } catch (e) {
      return new Promise<any>((resolve) => {
        resolve({condition: 'false', message: e.message})
      })
    }
  }

  // post data to server and get two type of response
  Post_Data_GetFile(path: string, jsondata: any) {
    path = this.globalurl + path;
    const request = new HttpRequest('POST', path, jsondata, {
      responseType: 'blob',
      reportProgress: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization',this.sessionManageMent.getAuthToken)
    });
    return this.httpClient.request(request);
  }

  Get_Data_With_DownloadStatus_GetFile(path: string) {
    path = this.globalurl + path;
    const request = new HttpRequest('GET', path, {
      responseType: 'blob',
      reportProgress: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization',this.sessionManageMent.getAuthToken)
    });
    return this.httpClient.request(request);
  }

  blobToString(b) {
    var urldata, x;
    urldata = URL.createObjectURL(b);
    x = new XMLHttpRequest();
    x.open('GET', urldata, false); // although sync, you're not fetching over internet
    x.send();
    URL.revokeObjectURL(urldata);
    return x.responseText;
  }

}
