import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SessionManageMent} from '../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../@pristine/process/WebApiHttp.services';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {EncriptDecript} from '../../../../@pristine/process/EncriptDecript';
import {MatDialog} from '@angular/material/dialog';
import {CreateSalePersonComponent} from './create-sale-person/create-sale-person.component';
import {isArray} from 'rxjs/internal-compatibility';
import {PromiseResponse} from '../../../modal/PromiseResponse';
import {NgxSpinnerService} from 'ngx-spinner';
import {PaytosalepersonComponent} from './paytosaleperson/paytosaleperson.component';
import {StoreMasterListModel} from "../pos_store/pos_store.component";

@Component({
  selector: 'app-pos-sale-person',
  templateUrl: './pos-sale-person.component.html',
  styleUrls: ['./pos-sale-person.component.scss']
})
export class PosSalePersonComponent implements OnInit {

  displayedColumns: string[] = ['code','name', 'email_id', 'phone_no','employee_id','Total_amount', 'Edit','Delete'];
  viewSalepersonDataSource: MatTableDataSource<SalePersonMasterListModel> = new MatTableDataSource<SalePersonMasterListModel>();
  @ViewChild('first_paginator', {static: true}) first_paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  loadding: boolean = false;

  constructor(public sessionManageMent: SessionManageMent,
              public webApiHttp: WebApiHttp,
              private _formBuilder: FormBuilder,
              private _toster: ToastrService,
              private router: Router,
              private encriptDecript: EncriptDecript,
              private dialog: MatDialog,
              private spinner : NgxSpinnerService) {
  }
  store_ListData: Array<StoreMasterListModel> = [];

  getPosStoreList() {
    this.loadding = true;
    this.webApiHttp.Get(this.webApiHttp.ApiURLArray.pos_GetStoreLocationList + 'Store&email_id='+this.sessionManageMent.getEmail).then((result) => {
      var response: Array<StoreMasterListModel> = result;
      if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
        this.store_ListData = response;
      }
    }).catch(error => {
      this._toster.error(error, 'Error');
    }).finally(() => {
      this.loadding = false;
    });
  }

  ngOnInit(): void {
    this.getPosStoreList();
  }


  applyFilter(filterValue: string, keyName: string) {
    this.viewSalepersonDataSource.filter = filterValue;
    this.viewSalepersonDataSource.filterPredicate = function (data, filter: string): boolean {
      if (data[keyName] != undefined && data[keyName] != null && data[keyName] != '') {
        return (data[keyName] != null && data[keyName] != undefined ? data[keyName].toString().toLowerCase() : '').includes(filter.toLowerCase());
      } else {
        return false;
      }
    };
  }

  global_location_id:string='';
  getSalePersonViewList(location_id) {
    this.global_location_id=location_id;
    this.viewSalepersonDataSource=new MatTableDataSource<SalePersonMasterListModel>([]);
    this.loadding = true;
    this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_sale_person_detail+location_id).then((result) => {
      var response: Array<SalePersonMasterListModel> = result;
      if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
        this.viewSalepersonDataSource = new MatTableDataSource<SalePersonMasterListModel>(response);
        this.viewSalepersonDataSource.paginator = this.first_paginator;
        this.viewSalepersonDataSource.sort = this.sort;
      } else {
        this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
      }
    }).catch(error => {
      this._toster.error(error, 'Error');
    }).finally(() => {
      this.loadding = false;
    });
  }

  AddSalePersonList(flag:string,passdata:SalePersonMasterListModel) {
    if(this.global_location_id==null||this.global_location_id==undefined ||this.global_location_id==''){
      this._toster.error('Please Select Location First','Error');
      return;
    }

    const dialogRef = this.dialog.open(CreateSalePersonComponent, {
      data: {
        flag: flag,
        sale_person_Data:passdata,
        store_id:this.global_location_id
      }, width: '600px'
    });
    dialogRef.afterClosed().subscribe((response:Array<SalePersonMasterListModel>) => {
      if (response) {
        if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
          this.getSalePersonViewList( this.global_location_id);
          this._toster.success(response[0].message, "Success");
          this.viewSalepersonDataSource = new MatTableDataSource<SalePersonMasterListModel>(response);
          this.viewSalepersonDataSource.paginator = this.first_paginator;
          this.viewSalepersonDataSource.sort = this.sort;
        } else {
          this._toster.error(response.length > 0 ? response[0].message : "Response is not proper.", "Error");
        }
      }
    });
  }
  DeleteSalePerson(data) {
    this.spinner.show();

    const json={
      flag: "delete",
      code:data?.code,
      location_id:this.sessionManageMent.getLocationId
    }

    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.sale_person_create, json).then(result => {
      if (isArray(result)) {
        let response: Array<PromiseResponse> = result;
        if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
          this._toster.success(response[0].message, "Success");
          this.getSalePersonViewList( this.global_location_id);
        } else {
          this._toster.error(response.length > 0 ? response[0].message : "Response is not proper.", "Error");
        }
      } else this._toster.error(result.message, "Error");
    }).catch(result => {
      this._toster.error(result.message, "Error");
    }).finally(() => {
      this.spinner.hide();
    });
  }
  openPaidToSalePerson(element){
    const dialogRef = this.dialog.open(PaytosalepersonComponent, {
      data: {
        SalePersonData:element
      }, width: '600px'
    });
    dialogRef.afterClosed().subscribe((response:Array<SalePersonMasterListModel>) => {
      if (response) {
        if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
          this.getSalePersonViewList( this.global_location_id);
          this._toster.success(response[0].message, "Success");
          this.viewSalepersonDataSource = new MatTableDataSource<SalePersonMasterListModel>(response);
          this.viewSalepersonDataSource.paginator = this.first_paginator;
          this.viewSalepersonDataSource.sort = this.sort;
        } else {
          this._toster.error(response.length > 0 ? response[0].message : "Response is not proper.", "Error");
        }
      }
    });
  }

}

export class SalePersonMasterListModel {
  condition: string;
  message:string
  code:string;
  name:string;
  email_id:string;
  phone_no:string;
  sale_commission:string;
  employee_id:string;
  paid_from_date:any;
  paid_to_date:any;
}
