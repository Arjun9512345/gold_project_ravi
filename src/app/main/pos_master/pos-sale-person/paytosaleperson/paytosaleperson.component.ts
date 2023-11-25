import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {WebApiHttp} from '../../../../../@pristine/process/WebApiHttp.services';
import {ToastrService} from 'ngx-toastr';
import {ValidateResponse} from '../../../../../@pristine/process/ValidateResponse';
import {FormBuilder} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {SessionManageMent} from '../../../../../@pristine/process/SessionManageMent';
import {isArray} from 'rxjs/internal-compatibility';
import {PromiseResponse} from '../../../../modal/PromiseResponse';
import {SalePersonMasterListModel} from '../pos-sale-person.component';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-paytosaleperson',
  templateUrl: './paytosaleperson.component.html',
  styleUrls: ['./paytosaleperson.component.scss']
})
export class PaytosalepersonComponent implements OnInit {

  name:string='';
  email_id:string='';
  phone_no:string='';
  sale_commission:string='';
  code: string='';
  from_date:any;
  to_date:any;
  today = new Date();
  total_commission: number=0;
  total_amount: number=0;
  constructor(public dialogRef: MatDialogRef<PaytosalepersonComponent>,
              private webApiHttp: WebApiHttp,
              private pristineToaster: ToastrService,
              private validateResponse: ValidateResponse,
              private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService,
              private  sessionManagement : SessionManageMent,
              private datePipe:DatePipe,
              @Inject(MAT_DIALOG_DATA) public data: PassData) {


  }


  ngOnInit() {
    console.log(this.data);
    this.from_date=this.data?.SalePersonData.paid_from_date;
    // if (this.data.flag == 'Update Sale Person') {
    //   this.code=this.data.sale_person_Data?.code;
    //   this.name=this.data.sale_person_Data?.name;
    //   this.email_id=this.data.sale_person_Data?.email_id;
    //   this.phone_no=this.data.sale_person_Data?.phone_no;
    //   this.sale_commission=this.data.sale_person_Data?.sale_commission;
    //
    // }
  }

  close() {
    this.dialogRef.close();
  }

  getTotalCommission(){
    const json = {
      code:this.data.SalePersonData.code,
      paid_from_date:this.datePipe.transform(this.from_date,'yyyy-MM-dd'),
      paid_to_date:this.datePipe.transform(this.to_date,'yyyy-MM-dd'),
    };
    console.log(json);
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.get_sale_person_commission_by_date, json).then(result => {
      if (result[0].condition.toLowerCase()=='true') {
        console.log(result);
        this.total_amount=result[0]?.total_amount;
        this.total_commission=result[0]?.total_commission;
      } else this.pristineToaster.error(result.message, "Error");
    }).catch(result => {
      this.pristineToaster.error(result.message, "Error");
    }).finally(() => {
      this.spinner.hide();
    });
  }


  OnsubmitHit() {
    // this.spinner.show();
    const json = {
      code:this.data.SalePersonData.code,
      paid_from_date:this.datePipe.transform(this.from_date,'yyyy-MM-dd'),
      paid_to_date:this.datePipe.transform(this.to_date,'yyyy-MM-dd'),
      total_commission:this.total_commission,
      payment_by:this.sessionManagement.getEmail
    };
    console.log(json);

    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.sale_person_payment, json).then(result => {
      if (isArray(result)) {
        let response: Array<PromiseResponse> = result;
        if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
          // this.pristineToaster.success(response[0].message, "Success");
          this.dialogRef.close(response);
        } else {
          this.pristineToaster.error(response.length > 0 ? response[0].message : "Response is not proper.", "Error");
        }
      } else this.pristineToaster.error(result.message, "Error");
    }).catch(result => {
      this.pristineToaster.error(result.message, "Error");
    }).finally(() => {
      this.spinner.hide();
    });
  }

}

interface PassData {
  SalePersonData: SalePersonMasterListModel;

}
