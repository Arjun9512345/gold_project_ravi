import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {WebApiHttp} from '../../../../../@pristine/process/WebApiHttp.services';
import {NgxSpinnerService} from 'ngx-spinner';
import {ValidateResponse} from "../../../../../@pristine/process/ValidateResponse";
import {isArray} from "rxjs/internal-compatibility";
import {PromiseResponse} from "../../../../modal/PromiseResponse";
import {HttpClient} from "@angular/common/http";
import {CustomerListModel} from "../pos_customer.component";
import {DatePipe} from "@angular/common";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";

@Component({
  selector: 'app-create-brand',
  templateUrl: './create-pos_customer.component.html',
  styleUrls: ['./create-pos_customer.component.scss']
})
export class CreatePos_customerComponent implements OnInit {
  countryList: Array<{ name: string; code: string; }> = [];
  state_List: Array<{
    active: string;
    code: string;
    condition: string;
    name: string;
  }> = [];
  district_list: Array<{
    condition: string;
    district_name: string;
    state_code: string;
  }> = [];
  first_Name: string = '';
  last_Name: string = '';
  dob: FormControl = new FormControl('');
  email: FormControl = new FormControl('', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z.]{3,5}$')]);
  address: string = '';
  phone_no: string = '';
  gender: string = '';
  note: string = '';
  city: string = '';
  state: string = '';
  country: string = '';
  source_of_know: string = '';
  cust_id: string = '';


  constructor(public dialogRef: MatDialogRef<CreatePos_customerComponent>,
              private webApiHttp: WebApiHttp,
              private pristineToaster: ToastrService,
              private validateResponse: ValidateResponse,
              private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService,
              private datepipe: DatePipe,
              private sessionManageMent: SessionManageMent,
              private httpClient: HttpClient,
              @Inject(MAT_DIALOG_DATA) public data: PassData) {
    this.httpClient.get("assets/country.json").toPromise().then((result: Array<{ name: string; code: string; }>) => {
      this.countryList = result;
    });


    try {
      if (data != null && data != undefined && data.flag == 'Add Customer' && this.data.values != null && this.data.values != undefined && this.data.values != '') {
        let phone_no: number = parseInt(this.data.values.toString());
        if (!isNaN(phone_no)) {
          this.phone_no = phone_no.toString();
        } else {
          if (this.data.values.indexOf(' ')) {
            this.first_Name = this.data.values.split(' ')[0]
            this.last_Name = this.data.values.split(' ')[1]
          } else {
            this.first_Name = this.data.values;
          }
        }
      }
    } catch (e) {

    }


  }

  bindDistrict(statecode: string) {
    this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetDistrictName + statecode).then(result => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        this.district_list = result;
      } else {
        this.district_list = [];
      }
    });
  }

  ngOnInit() {
    if (this.data.flag == 'Update Customer') {
      this.first_Name = this.data.customerData.first_name;
      this.last_Name = this.data.customerData.last_name;
      this.dob.setValue(new Date(this.data.customerData.date_of_birth));
      this.email.setValue(this.data.customerData.email_id);
      this.address = this.data.customerData.address;
      this.phone_no = this.data.customerData.phone_no;
      this.gender = this.data.customerData.gender;
      this.note = this.data.customerData.note;
      this.city = this.data.customerData.city;
      this.state = this.data.customerData.state;
      this.country = this.data.customerData.country;
      this.source_of_know = this.data.customerData.source_of_knowing;
      this.bindDistrict(this.data.customerData.state);
    }
    this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetStateName).then(result => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        this.state_List = result;
      }
    });
  }

  close() {
    this.dialogRef.close();
  }


  OnsubmitHit() {
    var json = {};

    if (this.email.value != '' && !this.email.valid) {
      this.pristineToaster.error("Please enter correct email or leave it blank", "Error");
      return;
    }

    this.spinner.show();

    if (this.data.flag == 'Add Customer') {
      json = {
        cust_id: this.sessionManageMent.getLocationId,
        first_Name: this.first_Name,
        last_Name: this.last_Name,
        dob: this.dob.value,
        email: this.email.value,
        address: this.address,
        phone_no: this.phone_no,
        gender: this.gender,
        note: this.note,
        city: this.city,
        state: this.state,
        country: this.country,
        source_of_know: this.source_of_know,
        flag: "insert"
      };
    } else {
      json = {
        first_Name: this.first_Name,
        last_Name: this.last_Name,
        dob: this.dob.value,
        email: this.email.value,
        address: this.address,
        phone_no: this.phone_no,
        gender: this.gender,
        note: this.note,
        city: this.city,
        state: this.state,
        country: this.country,
        source_of_know: this.source_of_know,
        flag: "update",
        cust_id: this.data.customerData.cust_id
      };
    }
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.pos_new_customer, json).then(result => {
      if (isArray(result)) {
        let response: Array<PromiseResponse> = result;
        if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
          this.pristineToaster.success(response[0].message, "Success");
          if (this.data.dailogOpen)
            this.dialogRef.close(response);
          else
            this.dialogRef.close(true);
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
  flag: string;
  dailogOpen: boolean;
  values: any;
  customerData: CustomerListModel;
}
