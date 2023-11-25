import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {WebApiHttp} from '../../../../@pristine/process/WebApiHttp.services';
import {SessionManageMent} from '../../../../@pristine/process/SessionManageMent';
import {MatDialog} from '@angular/material/dialog';
import {CreatePos_storeComponent} from './create-pos_store/create-pos_store.component';
import {Router} from "@angular/router";
import {EncriptDecript} from "../../../../@pristine/process/EncriptDecript";

@Component({
  selector: 'app-pos_store',
  templateUrl: './pos_store.component.html',
  styleUrls: ['./pos_store.component.scss']
})
export class Pos_storeComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'address', 'city','state','country','gst_type','gst_no','contact_no','email','price_group','is_ho', 'Action'];
  viewStoreDataSource: MatTableDataSource<StoreMasterListModel> = new MatTableDataSource<StoreMasterListModel>();
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
  }

  ngOnInit(): void {
    this.getStoreViewList();
  }


  applyFilter(filterValue: string, keyName: string) {
    this.viewStoreDataSource.filter = filterValue;
    this.viewStoreDataSource.filterPredicate = function (data, filter: string): boolean {
      if (data[keyName] != undefined && data[keyName] != null && data[keyName] != '') {
        return (data[keyName] != null && data[keyName] != undefined ? data[keyName].toString().toLowerCase() : '').includes(filter.toLowerCase());
      } else {
        return false;
      }
    };
  }

  getStoreViewList() {
    this.loadding = true;
    this.webApiHttp.Get(this.webApiHttp.ApiURLArray.pos_GetStoreLocationList+'Store').then((result) => {
      var response: Array<StoreMasterListModel> = result;
      if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
        this.viewStoreDataSource = new MatTableDataSource<StoreMasterListModel>(response);
        this.viewStoreDataSource.paginator = this.first_paginator;
        this.viewStoreDataSource.sort = this.sort;
      } else {
        this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
      }
    }).catch(error => {
      this._toster.error(error, 'Error');
    }).finally(() => {
      this.loadding = false;
    });
  }

  AddStoreList(flag:string,passdata:StoreMasterListModel) {

    const dialogRef = this.dialog.open(CreatePos_storeComponent, {
      data: {
        flag: flag,
        store_Data:passdata
      }, width: '600px'
    });
    dialogRef.afterClosed().subscribe((response:Array<StoreMasterListModel>) => {
      if (response) {
        if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
          this._toster.success(response[0].message, "Success");
          this.viewStoreDataSource = new MatTableDataSource<StoreMasterListModel>(response);
          this.viewStoreDataSource.paginator = this.first_paginator;
          this.viewStoreDataSource.sort = this.sort;
        } else {
          this._toster.error(response.length > 0 ? response[0].message : "Response is not proper.", "Error");
        }
      }
    });
  }


}

export class StoreMasterListModel {
  condition: string;
  message:string
  id:string;
  name:string;
  type:string;
  address:string;
  city:string;
  state:string;
  country:string;
  gst_type:string;
  gst_no:string;
  contact_no:string;
  email:string;
  price_group:string;
  is_ho:number;
}


