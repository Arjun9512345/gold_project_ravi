import {Component, OnInit, ViewChild} from '@angular/core';
import {SessionManageMent} from '../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../@pristine/process/WebApiHttp.services';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {StoreMasterListModel} from '../../pos_master/pos_store/pos_store.component';
import {DatePipe} from '@angular/common';
import {ExcelService} from "../../../../@pristine/process/excel.Service";
import {forEach} from "lodash";

@Component({
  selector: 'app-customerwise-report',
  templateUrl: './customerwise-report.component.html',
  styleUrls: ['./customerwise-report.component.scss'],
})
export class CustomerwiseReportComponent implements OnInit {

  today = new Date();
  loadding: boolean = false;
  customerData:Array<any>=[];
  customerWiseForm: FormGroup;
  showTable:boolean=false;
  storeMasterListModels: Array<StoreMasterListModel> = [];


  constructor(public sessionManageMent: SessionManageMent,
              public webApiHttp: WebApiHttp,
              private _formBuilder: FormBuilder,
              private _toster: ToastrService,
              private  excelService: ExcelService,
              private datePipe:DatePipe) {
    this.webApiHttp.Get(this.webApiHttp.ApiURLArray.pos_GetStoreLocationList + 'store&email_id='+this.sessionManageMent.getEmail).then(result => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        this.storeMasterListModels = result;
      }
    });
    this.customerWiseForm = _formBuilder.group({
      store_id: ['', Validators.required],
      from_date: ['', Validators.required],
      to_date: ['', Validators.required],
    });
  }

  ngOnInit(): void {

  }


  getCreditNoteViewList() {
    this.loadding = true;
    let location_string='';
    let temp_loc:Array<string>=this.customerWiseForm.get('store_id').value;
    for(let i=0;i<temp_loc.length;i++){
      console.log(temp_loc[i])
      location_string+=temp_loc[i]+((i==temp_loc.length-1)?'':'___')
    }
    const json={
      store_id: location_string,
      from_date: this.datePipe.transform(this.customerWiseForm.get('from_date').value,'yyyy-MM-dd'),
      to_date: this.datePipe.transform(this.customerWiseForm.get('to_date').value,'yyyy-MM-dd'),
    }
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.customer_wise_report,json).then((result) => {
      if(result[0].condition.toLowerCase()=='true') {
this.getTotalAmount();
        this.customerData = result;
        this.showTable = true
      }else{
        this._toster.info(result[0].message, 'Info');
        this.showTable=false;
        this.loadding=false;
      }

    }).catch(error => {
      this._toster.error(error, 'Error');
    }).finally(() => {
      this.loadding = false;
    });
  }

  downloadExcel() {

    this.excelService.MultisheetWorkbook([this.customerData],['Customer Data'],'Cycle Count Details')
  }
  async getTotalAmount() {

    for (let item of this.customerData) {
      let sum = 0;
      await item.sp.forEach(subitem => {
        sum += subitem.amount;
      });
      item.total_amount = sum;
    }
  }
}

