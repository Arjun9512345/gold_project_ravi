import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {WebApiHttp} from '../../../../../@pristine/process/WebApiHttp.services';
import {NgxSpinnerService} from 'ngx-spinner';
import {ValidateResponse} from "../../../../../@pristine/process/ValidateResponse";
import {isArray} from "rxjs/internal-compatibility";
import {PromiseResponse} from "../../../../modal/PromiseResponse";
import {HttpClient} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import {StoreMasterListModel} from "../pos_store.component";

@Component({
  selector: 'app-create_pos_store_page',
  templateUrl: './create-pos_store.component.html',
  styleUrls: ['./create-pos_store.component.scss']
})
export class CreatePos_storeComponent implements OnInit {
  countryList: Array<{ name: string; code: string; }> = [];
  state_List: Array<{ active: string;
    code: string;
    condition: string;
    name: string; }> = [];
  district_list: Array<{
    condition: string;
    district_name: string;
    state_code: string;
  }> = [];

  name:string='';
  address:string='';
  city:string='';
  state:string='';
  country:string='';
  gst_type:string='';
  gst_no:string='';
  contact_no:string='';
  email:string='';
  price_group:string='';
  is_ho:boolean=false;
price_group_list_data:Array<{condition: string;group_code: string;group_name: string}>=[];
  constructor(public dialogRef: MatDialogRef<CreatePos_storeComponent>,
              private webApiHttp: WebApiHttp,
              private pristineToaster: ToastrService,
              private validateResponse: ValidateResponse,
              private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService,
              private datepipe: DatePipe,
              private httpClient: HttpClient,
              @Inject(MAT_DIALOG_DATA) public data: PassData) {
    this.httpClient.get("assets/country.json").toPromise().then((result: Array<{ name: string; code: string; }>) => {
      this.countryList = result;
    });
    this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetStateName).then(result=>{
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        this.state_List=result;
      }
    });
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.pos_InsertUpdateSelectPriceGroup,{
      flag: "SELECT",
      priceGroupCode: "",
      priceGroupName: ""
    }).then(result=>{
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        this.price_group_list_data=result;
      }
    });
  }
  bindDistrict(statecode:string){
    this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetDistrictName+statecode).then(result=>{
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        this.district_list=result;
      }else {
        this.district_list=[];
      }
    });
  }

  ngOnInit() {
    if (this.data.flag == 'Update Store') {
      this.name=this.data.store_Data.name;
      this.address=this.data.store_Data.address;
      this.city=this.data.store_Data.city;
      this.state=this.data.store_Data.state;
      this.country=this.data.store_Data.country;
      this.gst_type=this.data.store_Data.gst_type;
      this.gst_no=this.data.store_Data.gst_no;
      this.contact_no=this.data.store_Data.contact_no;
      this.email=this.data.store_Data.email;
      this.price_group=this.data.store_Data.price_group;
      this.is_ho=this.data.store_Data.is_ho>0?true:false;
      this.bindDistrict(this.data.store_Data.state);
    }
  }

  close() {
    this.dialogRef.close();
  }


  OnsubmitHit() {
    this.spinner.show();
    var json = {};
    if (this.data.flag == 'Add Store') {
      json = {
        flag: "insert",
        id:'',
        name:this.name,
        type:'Store',
        address:this.address,
        city:this.city,
        state:this.state,
        country:this.country,
        gst_type:this.gst_type,
        gst_no:this.gst_no,
        contact_no:this.contact_no,
        email:this.email,
        price_group:this.price_group,
        is_ho:this.is_ho?1:0
      };
    } else {
      json = {
        flag: "update",
        id:this.data.store_Data.id,
        name:this.name,
        type:'Store',
        address:this.address,
        city:this.city,
        state:this.state,
        country:this.country,
        gst_type:this.gst_type,
        gst_no:this.gst_no,
        contact_no:this.contact_no,
        email:this.email,
        price_group:this.price_group,
        is_ho:this.is_ho?1:0
      };
    }
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.pos_InsertStoreLocationList, json).then(result => {
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
  store_Data: StoreMasterListModel;
}
