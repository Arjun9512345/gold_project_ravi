import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {WebApiHttp} from '../../../../../@pristine/process/WebApiHttp.services';
import {ToastrService} from 'ngx-toastr';
import {ValidateResponse} from '../../../../../@pristine/process/ValidateResponse';
import {FormBuilder} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';

import {isArray} from 'rxjs/internal-compatibility';
import {PromiseResponse} from '../../../../modal/PromiseResponse';
import {SalePersonMasterListModel} from '../pos-sale-person.component';
import {SessionManageMent} from '../../../../../@pristine/process/SessionManageMent';

@Component({
  selector: 'app-create-sale-person',
  templateUrl: './create-sale-person.component.html',
  styleUrls: ['./create-sale-person.component.scss']
})
export class CreateSalePersonComponent implements OnInit {


  name: string = '';
  email_id: string = '';
  phone_no: string = '';
  zivame_employee_id: string = '';
  code: string = '';

  constructor(public dialogRef: MatDialogRef<CreateSalePersonComponent>,
              private webApiHttp: WebApiHttp,
              private pristineToaster: ToastrService,
              private validateResponse: ValidateResponse,
              private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService,
              private sessionManagement: SessionManageMent,
              @Inject(MAT_DIALOG_DATA) public data: PassData) {


  }


  ngOnInit() {
    if (this.data.flag == 'Update Sale Person') {
      this.code = this.data.sale_person_Data?.code;
      this.name = this.data.sale_person_Data?.name;
      this.email_id = this.data.sale_person_Data?.email_id;
      this.phone_no = this.data.sale_person_Data?.phone_no;
      this.zivame_employee_id = this.data.sale_person_Data?.employee_id;
    }
  }

  close() {
    this.dialogRef.close();
  }


  OnsubmitHit() {
    this.spinner.show();
    var json = {};
    if (this.data.flag == 'Add Sale Person') {
      json = {
        flag: "insert",
        code: '',
        name: this.name,
        email_id: this.email_id,
        location_id: this.data.store_id,
        phone_no: this.phone_no,
        sale_commission: 0,
        employee_id: this.zivame_employee_id,
        created_by: this.sessionManagement.getEmail
      };
    } else {
      json = {
        flag: "update",
        code: this.code,
        name: this.name,
        email_id: this.email_id,
        location_id: this.data.store_id,
        phone_no: this.phone_no,
        sale_commission: 0,
        employee_id: this.zivame_employee_id,
        created_by: this.sessionManagement.getEmail
      };
    }
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.sale_person_create, json).then(result => {
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
  flag: string;
  sale_person_Data: SalePersonMasterListModel;
  store_id: string;
}


