import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {WebApiHttp} from '../../../../@pristine/process/WebApiHttp.services';
import {SessionManageMent} from '../../../../@pristine/process/SessionManageMent';
import {MatDialog} from '@angular/material/dialog';
import {CreatePos_customerComponent} from './create-pos_customer/create-pos_customer.component';
import {Router} from "@angular/router";
import {EncriptDecript} from "../../../../@pristine/process/EncriptDecript";
import {PaggingModel} from "../../../modal/PaggingModel";

@Component({
  selector: 'app-product_brand',
  templateUrl: './pos_customer.component.html',
  styleUrls: ['./pos_customer.component.scss']
})
export class Pos_customerComponent implements OnInit {

  displayedColumns: string[] = ['cust_id', 'first_name', 'last_name', 'email_id', 'phone_no', 'city', 'state', 'country', 'create_datetime', 'store_credit_amount', 'Action','Sale'];
  viewCustomerDataSource: MatTableDataSource<CustomerListModel> = new MatTableDataSource<CustomerListModel>();
  @ViewChild('first_paginator', {static: true}) first_paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  loadding: boolean = false;

  constructor(public sessionManageMent: SessionManageMent,
              public webApiHttp: WebApiHttp,
              private _formBuilder: FormBuilder,
              private _toster: ToastrService,
              private router: Router,
              private encriptDecript: EncriptDecript,
              private dialog: MatDialog) {
    try {
      let paggingData: PaggingModel = this.sessionManageMent.getCustomerPagging;
      if (paggingData != null && paggingData != undefined) {
        this.PageNumber = paggingData.page_number;
      }
    } catch (e) {

    }
  }

  length = 0;
  RowsPerPage = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  PageNumber = 0;

  ngOnInit(): void {
    this.getCustomerViewList('');
  }

  filter_dynamic: Array<{ filterKey: string, filter_value: string }> = [];

  applyFilter(filterValue: string, keyName: string) {
    if (filterValue == '') {
      for (let i = 0; i < this.filter_dynamic.length; i++) {
        if (this.filter_dynamic[i].filterKey == keyName && filterValue == '') {
          this.filter_dynamic.splice(i, 1);
          break;
        }
      }
    }
    if (keyName != '' && filterValue != '') {
      let validate: boolean = false;
      Array.from(this.filter_dynamic).forEach(item => {
        if (item.filterKey == keyName) {
          item.filter_value = filterValue;
          validate = true;
        }
      });
      if (!validate) {
        this.filter_dynamic.push({filterKey: keyName, filter_value: filterValue});
      }
    }
    let query = '';
    for (let i = 0; i < this.filter_dynamic.length; i++) {
      if (this.filter_dynamic[i].filter_value != '') {
        if (i == 0)
          query = ' Where [pc].' + this.filter_dynamic[i].filterKey + " like '%" + this.filter_dynamic[i].filter_value + "%'" + (i == this.filter_dynamic.length - 1 ? '' : ' AND ')
        else
          query += ' [pc].' + this.filter_dynamic[i].filterKey + " like '%" + this.filter_dynamic[i].filter_value + "%'" + (i == this.filter_dynamic.length - 1 ? '' : ' AND ')
      }
    }
    this.getCustomerViewList(query);
  }


  getCustomerViewList(qery_parameter: string) {
    this.loadding = true;
    var json = {
      RowsPerPage: this.RowsPerPage,
      PageNumber: this.PageNumber,
      qery_parameter: qery_parameter
    }
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.pos_all_customer, json).then((result) => {
      var response: Array<CustomerListModel> = result;
      if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
        this.length = result[0].total_rows;
        this.viewCustomerDataSource = new MatTableDataSource<CustomerListModel>(response);
        this.viewCustomerDataSource.paginator = this.first_paginator;
        this.viewCustomerDataSource.sort = this.sort;
        this.clickOnRow('');
      } else {
        this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
      }
    }).catch(error => {
      this._toster.error(error, 'Error');
    }).finally(() => {
      this.loadding = false;
    });
  }

  clickOnRow(cust_id: string) {
    var paggingData: PaggingModel = new PaggingModel();
    if (cust_id == null || cust_id == undefined || cust_id == '') {
      paggingData = this.sessionManageMent.getCustomerPagging;
      if (paggingData == null || paggingData == undefined) {
        paggingData = new PaggingModel();
        paggingData.primary_value = cust_id
        paggingData.page_number = this.PageNumber;
      }
    } else {
      paggingData.primary_value = cust_id
      paggingData.page_number = this.PageNumber;
    }


    this.viewCustomerDataSource.data.map(item => {
      if ((cust_id == item.cust_id || paggingData.primary_value == item.cust_id) && paggingData.page_number == this.PageNumber) {
        this.sessionManageMent.setCustomerPagging({
          primary_value: paggingData.primary_value,
          page_number: paggingData.page_number
        });
        item.highlighted = true;
      } else
        item.highlighted = false
    });
  }

  myPagginaterEvent(event) {
    this.RowsPerPage = event.pageSize;
    this.PageNumber = event.pageIndex;
    this.applyFilter('', '');
  }

  AddBrandList(flag: string, passdata: CustomerListModel) {
    if (flag == 'Update Customer')
      this.clickOnRow(passdata.cust_id);
    const dialogRef = this.dialog.open(CreatePos_customerComponent, {
      data: {
        flag: flag,
        dailogOpen: false,
        customerData: passdata
      }, width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCustomerViewList('');
      }
    });
  }

  navigatetosaleHistory(customer_phone_no:string){
    this.router.navigate(['/pointofsale/sale_history_all',{customer_phone_no:this.encriptDecript.encrypt( customer_phone_no)}])
  }

}

export class CustomerListModel {
  condition: string;
  message: string
  address: string;
  city: string;
  country: string;
  cust_id: string;
  gender: string;
  note: string;
  phone_no: string;
  state: string;

  first_name: string;
  last_name: string;
  date_of_birth: string;
  email_id: string;
  create_datetime: string;
  updated_datetime: string;
  source_of_knowing: string;
  store_credit: string;
  reward_point: string;
  outstanding: string;
  hovered: boolean;
  highlighted: boolean;
}


