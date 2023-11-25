import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SaleOrderDetail} from "../processSale.component";
import {ToastrService} from "ngx-toastr";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {NgxSpinnerService} from "ngx-spinner";
import {HttpEvent, HttpEventType} from "@angular/common/http";
import * as FileSaver from 'file-saver';
import {SignalR} from "../../../../../@pristine/process/SignalR";

@Component({
  selector: 'app-create-payment_page',
  templateUrl: './create-payment_page.component.html',
  styleUrls: ['./create-payment_page.component.scss']
})
export class CreatePayment_pageComponent implements OnInit {

  FooterSection: string = '';
  FooterSection2: string = '';
  FooterSection3: string = '';
  enter_user_input_amount: string = (Math.round(this.data.sale_data.total_amount - this.data.sale_data.cashback_apply_amount)).toString();
  date: Date = new Date();
  pay_by_cod: boolean = false;
  pay_by_cod_amount: number = 0;
  pay_by_cod_amount_return_to_customer: number = 0;
  pay_by_card: boolean = false;
  pay_by_card_amount: number = 0;
  pay_by_paytm: boolean = false;
  pay_by_paytm_amount: number = 0;
  pay_by_credit: boolean = false;
  pay_by_credit_amount: number = 0;
  pay_by_upi: boolean = false;
  pay_by_upi_amount: number = 0;
  pay_by_giftcard: boolean = false;
  pay_by_giftcard_amount: number = 0;
  total_remaining_amount: number = parseFloat((Math.round(this.data.sale_data.total_amount - this.data.sale_data.cashback_apply_amount)).toFixed(2));
  credit_note_list: Array<CreditNoteNo> = [];
  gift_card_list: Array<GiftCardNo> = [];
  card_no: string = '';
  card_month: string = '';
  card_year: string = '';
  credit_note_no: string = '';
  gift_card_no: string = '';
  card_holder_name: string = '';
  paytm_mobile_no: string = '';
  UPI_no: string = '';

  constructor(public dialogRef: MatDialogRef<CreatePayment_pageComponent>,
              private _toster: ToastrService,
              private webApiHttp: WebApiHttp,
              private sessionManageMent: SessionManageMent,
              private ngxSpinnerService: NgxSpinnerService,
              private _signalR: SignalR,
              @Inject(MAT_DIALOG_DATA) public data: PassData) {

  }

  get getRemainingAmount(): number {
    let pay_by_cod_amount: number = this.pay_by_cod_amount;
    let pay_by_cod_amount_customer_return = this.pay_by_cod_amount_return_to_customer
    let pay_by_card_amount: number = this.pay_by_card_amount;
    let pay_by_paytm_amount: number = this.pay_by_paytm_amount;
    let pay_by_credit_amount: number = this.pay_by_credit_amount;
    let pay_by_upi_amount: number = this.pay_by_upi_amount;
    let pay_by_gift_card_amount: number = this.pay_by_giftcard_amount;


    let remaining_amount = parseFloat((Math.round(this.data.sale_data.total_amount - this.data.sale_data.cashback_apply_amount)).toFixed(2)) -
      ((pay_by_cod_amount + pay_by_cod_amount_customer_return) + pay_by_paytm_amount + pay_by_card_amount + pay_by_credit_amount + pay_by_upi_amount + pay_by_gift_card_amount);

    this.total_remaining_amount = parseFloat(remaining_amount.toFixed(2));

    return parseFloat(remaining_amount.toFixed(2));
  }

  getRounded_Amount(amounnt: number): number {
    let round_value: number = ((Math.round(amounnt)) - amounnt);
    return round_value;
  }

  getTotal_Amount(amounnt: number): number {
    let round_value: number = Math.round(amounnt);
    return round_value;
  }

  CalculateUserReturnAmountRemainAmount() {
    let pay_by_cod_amount: number = this.pay_by_cod_amount;
    let pay_by_card_amount: number = this.pay_by_card_amount;
    let pay_by_paytm_amount: number = this.pay_by_paytm_amount;
    let pay_by_credit_amount: number = this.pay_by_credit_amount;
    let pay_by_upi_amount: number = this.pay_by_upi_amount;
    let total_payed_amount = (pay_by_cod_amount + pay_by_paytm_amount + pay_by_card_amount + pay_by_credit_amount + pay_by_upi_amount);

    let temp_user_remain_amount = parseFloat((Math.round(this.data.sale_data.total_amount - this.data.sale_data.cashback_apply_amount)).toFixed(2)) - total_payed_amount
    if (temp_user_remain_amount >= 0)
      this.pay_by_cod_amount_return_to_customer = 0;
    else {
      this.pay_by_cod_amount_return_to_customer = temp_user_remain_amount;
      this.enter_user_input_amount = "0";
    }
  }

  checkKeyCode(event) {
    console.log(event.keyCode)
    if (event.keyCode == 190 || event.keyCode == 69) {
      return false;
    } else true;

  }

  calculateCashByCardAndByCredit(flag: string) {
    let enter_user_input_amount = parseFloat(parseFloat(this.enter_user_input_amount).toFixed(2));
    if ((enter_user_input_amount - Math.round(enter_user_input_amount))) {
      this._toster.error('Amount Is Not Decimal Format.' + enter_user_input_amount, 'Error');
      return;
    }
    if (flag != 'CASH' && enter_user_input_amount > this.getRemainingAmount) {
      this._toster.error('Amount is Greter Then Remaining Amount ' + this.getRemainingAmount, 'Error');
      return;
    }
    if (flag == 'CASH') {
      this.pay_by_cod = !this.pay_by_cod;
      if (this.pay_by_cod) {
        if (enter_user_input_amount <= 0) {
          this.pay_by_cod = false;
          this.pay_by_cod_amount = 0;
          this._toster.error('Please Enter Cash Amount.', 'Error');
          return;
        }
        this.pay_by_cod_amount = enter_user_input_amount;
        this.enter_user_input_amount = this.getRemainingAmount.toString();
      } else {
        this.pay_by_cod_amount = 0;
        this.pay_by_cod_amount_return_to_customer = 0;
        this.enter_user_input_amount = this.getRemainingAmount.toString();
      }
    } else if (flag == 'PAYTM') {
      this.pay_by_paytm = !this.pay_by_paytm;
      if (this.pay_by_paytm) {
        // this.pay_by_card_amount = this.enter_user_input_amount;
        // this.enter_user_input_amount = 0;
        if (enter_user_input_amount <= 0) {
          this.pay_by_paytm = false;
          this.pay_by_paytm_amount = 0;
          this._toster.error('Please Enter Paytm Amount.', 'Error');
          return;
        }
        this.FooterSection = 'Paytm';
      } else {
        this.pay_by_paytm_amount = 0;
        this.enter_user_input_amount = this.getRemainingAmount.toString();
        this.FooterSection = '';
      }
    } else if (flag == 'UPI') {
      this.pay_by_upi = !this.pay_by_upi;
      if (this.pay_by_upi) {
        // this.pay_by_card_amount = this.enter_user_input_amount;
        // this.enter_user_input_amount = 0;
        if (enter_user_input_amount <= 0) {
          this.pay_by_upi = false;
          this.pay_by_upi_amount = 0;
          this._toster.error('Please Enter UPI Amount.', 'Error');
          return;
        }
        this.FooterSection = 'UPI';
      } else {
        this.pay_by_upi_amount = 0;
        this.enter_user_input_amount = this.getRemainingAmount.toString();
        this.FooterSection = '';
      }
    } else if (flag == 'CARD') {
      this.pay_by_card = !this.pay_by_card;
      if (this.pay_by_card) {
        // this.pay_by_card_amount = this.enter_user_input_amount;
        // this.enter_user_input_amount = 0;
        if (enter_user_input_amount <= 0) {
          this.pay_by_card = false;
          this.pay_by_card_amount = 0;
          this._toster.error('Please Enter Card Amount.', 'Error');
          return;
        }
        this.FooterSection = 'Card';
      } else {
        this.pay_by_card_amount = 0;
        this.enter_user_input_amount = this.getRemainingAmount.toString();
        this.FooterSection = '';
      }
    } else if (flag == 'CREDIT') {
      this.pay_by_credit = !this.pay_by_credit;
      if (this.pay_by_credit) {
        this.FooterSection = 'Credit'
      } else {
        this.FooterSection = '';
        this.pay_by_credit_amount = 0;
        this.enter_user_input_amount = this.getRemainingAmount.toString();
      }
    } else if (flag == 'Gift Card') {
      this.pay_by_giftcard = !this.pay_by_giftcard;
      if (this.pay_by_giftcard) {
        this.FooterSection = 'Gift Card'
      } else {
        this.FooterSection = '';
        this.gift_card_no = '';
        this.pay_by_giftcard_amount = 0;
        this.enter_user_input_amount = this.getRemainingAmount.toString();
      }
    }

    this.CalculateUserReturnAmountRemainAmount();
  }

  applyPaytmPayment() {
    if (this.paytm_mobile_no == '' || this.paytm_mobile_no == null || this.paytm_mobile_no == undefined) {
      this._toster.error('Please Enter Paytm Mobile No.', 'Error');
      return;
    }
    let enter_user_input_amount = parseFloat(parseFloat(this.enter_user_input_amount).toFixed(2));
    if (enter_user_input_amount <= 0) {
      this.pay_by_paytm = false;
      this.pay_by_paytm_amount = 0;
      this.FooterSection = ''
      this._toster.error('Please Enter Paytm Amount.', 'Error');
      return;
    }
    if (enter_user_input_amount > this.getRemainingAmount) {
      var data = this.getRemainingAmount;
      this._toster.error('Please Enter Amount < ' + data, 'Error');
      return;
    }
    this.pay_by_paytm_amount = enter_user_input_amount;
    this.enter_user_input_amount = this.getRemainingAmount.toString();
    this.CalculateUserReturnAmountRemainAmount();
  }

  applyUPIPayment() {
    if (this.UPI_no == '' || this.UPI_no == null || this.UPI_no == undefined) {
      this._toster.error('Please Enter UPI ID.', 'Error');
      return;
    }
    let enter_user_input_amount = parseFloat(parseFloat(this.enter_user_input_amount).toFixed(2));
    if (enter_user_input_amount <= 0) {
      this.pay_by_upi = false;
      this.pay_by_upi_amount = 0;
      this.FooterSection = ''
      this._toster.error('Please Enter Paytm Amount.', 'Error');
      return;
    }
    if (enter_user_input_amount > this.getRemainingAmount) {
      var data = this.getRemainingAmount;
      this._toster.error('Please Enter Amount < ' + data, 'Error');
      return;
    }
    this.pay_by_upi_amount = enter_user_input_amount;
    this.enter_user_input_amount = this.getRemainingAmount.toString();
    this.CalculateUserReturnAmountRemainAmount();
  }

  applyCardPayment() {
    // if (this.card_holder_name == '' || this.card_holder_name == null || this.card_holder_name == undefined) {
    //   this._toster.error('Please Enter Card Holder name.', 'Error');
    //   return;
    // }
    // if (this.card_no == '' || this.card_no == null || this.card_no == undefined) {
    //   this._toster.error('Please Enter Card No.', 'Error');
    //   return;
    // }
    // if (this.card_month == '' || this.card_month == null || this.card_month == undefined || this.card_year == '' || this.card_year == null || this.card_year == undefined) {
    //   this._toster.error('Please Enter Card Month And Year.', 'Error');
    //   return;
    // }
    let enter_user_input_amount = parseFloat(parseFloat(this.enter_user_input_amount).toFixed(2));
    if (enter_user_input_amount <= 0) {
      this.pay_by_card = false;
      this.pay_by_card_amount = 0;
      this.FooterSection = ''
      this._toster.error('Please Enter Card Amount.', 'Error');
      return;
    }
    if (enter_user_input_amount > this.getRemainingAmount) {
      var data = this.getRemainingAmount;
      this._toster.error('Please Enter Amount < ' + data, 'Error');
      return;
    }
    this.pay_by_card_amount = enter_user_input_amount;
    this.enter_user_input_amount = this.getRemainingAmount.toString();
    this.CalculateUserReturnAmountRemainAmount();
  }

  SearchCreditDataFromServer() {
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.get_search_CreditNotDetail, {
      credit_no: this.credit_note_no,
      customer_id: this.data.sale_data.cust_id
    }).then((result: Array<CreditNoteNo>) => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        this.credit_note_list = result;
      } else {
        this.credit_note_list = [];
      }
    }).finally(() => {
      this.ngxSpinnerService.hide();
    });
  }


  getCreditNoteDetail() {
    this.ngxSpinnerService.show();
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.Sale_get_CreditNotDetail, {
      credit_no: this.credit_note_no,
      customer_id: this.data.sale_data.cust_id
    }).then((result: Array<CreditNoteNo>) => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        if (this.getRemainingAmount <= Math.floor(result[0].credit_payment - result[0].credit_applied)) {
          this.pay_by_credit_amount = this.getRemainingAmount;
        } else {
          this.pay_by_credit_amount = Math.floor(parseFloat((result[0].credit_payment - result[0].credit_applied).toFixed(2)));
          if (Math.floor(result[0].credit_payment - result[0].credit_applied) == 0) {
            this._toster.warning('Credit Note No. Have ' + Math.floor(result[0].credit_payment - result[0].credit_applied) + ' Balance.', 'Warning');
          }
        }
      } else {
        this.credit_note_no = '';
        this._toster.error('Credit Note No. ' + this.credit_note_no + ' Not Found.', 'Error');
      }
    }).finally(() => {
      this.ngxSpinnerService.hide();
      this.enter_user_input_amount = this.getRemainingAmount.toString();
    });
  }


  getGiftCardDetail() {
    this.ngxSpinnerService.show();
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.search_open_gift_card, {
      gift_card_no: this.gift_card_no
    }).then((result: Array<any>) => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {

        if (Math.floor(result[0].remaining_amount) == 0) {
          this._toster.warning('Gift Card No. Have ' + Math.floor(result[0].remaining_amount) + ' Balance.', 'Warning');
        }

        if (this.getRemainingAmount <= Math.floor(result[0].remaining_amount)) {
          this.pay_by_giftcard_amount = this.getRemainingAmount;
        } else {
          this.pay_by_giftcard_amount = Math.floor(parseFloat((result[0].remaining_amount).toFixed(2)));
        }

        this.FooterSection = '';
      } else {
        this.gift_card_no = '';
        this._toster.error('Gift Card No. ' + this.gift_card_no + ' Not Found.', 'Error');
      }
    }).finally(() => {
      this.ngxSpinnerService.hide();
      this.enter_user_input_amount = this.getRemainingAmount.toString();
    });
  }


  ngOnInit() {

  }

  close() {
    this.dialogRef.close();
  }

  OnsubmitHit() {
    if (this.getRemainingAmount != 0) {
      this._toster.error('Please Enter Amount Properly.', 'Error');
      return;
    }
    if (this.pay_by_cod) {
      if (this.pay_by_cod_amount <= 0) {
        this._toster.error('Please Enter Cash Amount.', 'Error');
        return;
      }
    }
    if (this.pay_by_credit) {
      if (this.pay_by_credit_amount <= 0) {
        this._toster.error('Please Enter Credit Amount.', 'Error');
        return;
      }
      if (this.credit_note_no == null || this.credit_note_no == undefined || this.credit_note_no == '') {
        this._toster.error('Please Enter Credit Not No.', 'Error');
        return;
      }
    }
    if (this.pay_by_card) {
      if (this.pay_by_card_amount <= 0) {
        this._toster.error('Please Enter Card Amount.', 'Error');
        return;
      }
    }
    if (this.pay_by_paytm) {
      if (this.pay_by_paytm_amount <= 0) {
        this._toster.error('Please Enter Paytm Amount.', 'Error');
        return;
      }
      if (this.paytm_mobile_no == null || this.paytm_mobile_no == undefined || this.paytm_mobile_no == '') {
        this._toster.error('Please Enter Paytm Mobile No.', 'Error');
        return;
      }
    }
    if (this.pay_by_upi) {
      if (this.pay_by_upi_amount <= 0) {
        this._toster.error('Please Enter UPI Amount.', 'Error');
        return;
      }
      if (this.UPI_no == null || this.UPI_no == undefined || this.UPI_no == '') {
        this._toster.error('Please Enter UPI ID.', 'Error');
        return;
      }
    }

    if (this.pay_by_giftcard) {
      if (this.pay_by_giftcard_amount <= 0) {
        this._toster.error('Please Enter Gift Amount.', 'Error');
        return;
      }
      if (this.gift_card_no == null || this.gift_card_no == '') {
        this._toster.error('Please Enter Gift Card.', 'Error');
        return;
      }
    }


    this.ngxSpinnerService.show();
    var json = {
      so_no: this.data.sale_data.sale_header_no,
      pay_by_cash: this.pay_by_cod ? 'CASH' : '',
      cash_amount: this.pay_by_cod ? this.pay_by_cod_amount : 0,
      refund_pay_to_customer: this.pay_by_cod ? this.pay_by_cod_amount_return_to_customer : 0,
      pay_by_card: this.pay_by_card ? 'CARD' : '',
      card_amount: this.pay_by_card ? this.pay_by_card_amount : 0,
      card_no: this.card_no,
      card_month: this.card_month,
      card_year: this.card_year,
      pay_by_paytm: this.pay_by_paytm ? 'PAYTM' : '',
      paytm_amount: this.pay_by_paytm ? this.pay_by_paytm_amount : 0,
      paytm_mobile_no: this.paytm_mobile_no,
      pay_by_upi: this.pay_by_upi ? 'UPI' : '',
      upi_amount: this.pay_by_upi ? this.pay_by_upi_amount : 0,
      upi_id: this.UPI_no,
      pay_by_credit: this.pay_by_credit ? 'CREDIT' : '',
      credit_amount: this.pay_by_credit ? this.pay_by_credit_amount : 0,
      credit_note_no: this.credit_note_no,
      pay_by_giftcard: this.pay_by_giftcard ? 'GIFTCARD' : '',
      giftcard_amount: this.pay_by_giftcard ? this.pay_by_giftcard_amount : 0,
      giftcard_no: this.gift_card_no,

      email_id: this.sessionManageMent.getEmail,
      store_id: this.sessionManageMent.getLocationId,
      card_holder_name: this.card_holder_name,
      round_off_amount: this.getRounded_Amount(this.data?.sale_data.total_amount - this.data.sale_data.cashback_apply_amount)
    };
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.pos_sale_order_post, json).then(async (result) => {
      var response: Array<SaleOrderDetail> = result;
      if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
        await this.webApiHttp.Get_Data_With_DownloadStatus_GetFile(this.webApiHttp.ApiURLArray.SaleInvoiceReport + response[0].invoice_no)
          .subscribe(async (event: HttpEvent<any>) => {
            switch (event.type) {
              case HttpEventType.Sent:
                break;
              case HttpEventType.ResponseHeader:
                break;
              case HttpEventType.DownloadProgress:
                break;
              case HttpEventType.Response: {
                try {
                  if (event.body.type == "application/pdf") {
                    FileSaver.saveAs(event.body, 'invoice_' + response[0].invoice_no + '.pdf');
                    await this.downloadFile(event.body);
                  } else if (event.body.type == "application/json") {
                    const blb = new Blob([event.body], {type: "text/plain"});
                    var jsonresult = JSON.parse(this.webApiHttp.blobToString(blb));
                    if (jsonresult[0].condition.toUpperCase() == "FALSE") {
                      this._toster.error(jsonresult[0].message, "Error");
                    }
                  }
                } catch (e) {

                } finally {
                  this.ngxSpinnerService.hide();
                  this.dialogRef.close(true);
                }
                break;
              }
            }
          }, error => {
            this.ngxSpinnerService.hide();
            this.dialogRef.close();
            if (error.status == 401) {
              this._signalR.stopSignalRConnection();
              localStorage.clear();
            }

          });
      } else {
        this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
        this.ngxSpinnerService.hide();
      }
    }).catch(error => {
      this._toster.error(error, 'Error');
      this.ngxSpinnerService.hide();
    }).finally(() => {

    });
  }

  async downloadFile(data) {
    const blob = new Blob([data], {type: 'application/pdf'});
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = window.URL.createObjectURL(blob);
    document.body.appendChild(iframe);
    iframe.contentWindow.print();
  }

}

interface PassData {
  flag: string;
  sale_data: SaleOrderDetail;
}

interface CreditNoteNo {
  condition: string;
  credit_no: string;
  credit_payment: number;
  credit_applied: number;
  last_credit_applied_on: string;
}

interface GiftCardNo {
  condition: string;
  gift_card_no: string;
  remaning_amount: number;
}
