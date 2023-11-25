import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {WebApiHttp} from '../../../../@pristine/process/WebApiHttp.services';
import {SessionManageMent} from '../../../../@pristine/process/SessionManageMent';
import {MatDialog} from '@angular/material/dialog';
import {Router} from "@angular/router";
import {EncriptDecript} from "../../../../@pristine/process/EncriptDecript";
import {isArray} from "rxjs/internal-compatibility";
import {PromiseResponse} from "../../../modal/PromiseResponse";
import {pristineConfirmDialogComponent} from "../../../../@pristine/components/confirm-dialog/confirm-dialog.component";
import {StoreMasterListModel} from "../pos_store/pos_store.component";
import {PristineConfirmDialogPOSTerminalComponent} from "../../../../@pristine/components/confirm-dialog-pos_terminal/confirm-dialog-pos_terminal.component";

@Component({
  selector: 'app-POSTerminalMaster',
  templateUrl: './pos_terminal_mst.component.html',
  styleUrls: ['./pos_terminal_mst.component.scss']
})
export class Pos_terminal_mstComponent implements OnInit {

  displayedColumns: string[] = ['pos_code', 'store_code', 'computer_description','assign_email', 'Action'];
  viewBrandDataSource: MatTableDataSource<PosTerminalModel> = new MatTableDataSource<PosTerminalModel>();
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
    this.getPosStoreList();
  }


  applyFilter(filterValue: string, keyName: string) {
    this.viewBrandDataSource.filter = filterValue;
    this.viewBrandDataSource.filterPredicate = function (data, filter: string): boolean {
      if (data[keyName] != undefined && data[keyName] != null && data[keyName] != '') {
        return (data[keyName] != null && data[keyName] != undefined ? data[keyName].toString().toLowerCase() : '').includes(filter.toLowerCase());
      } else {
        return false;
      }
    };
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

  selectedStoreByUser: StoreMasterListModel = null;

  getPosTerminalViewList(storeData: StoreMasterListModel) {
    if (!this.loadding) {
      this.loadding = true;
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.pos_InsertUpdateSelectDeletePOSTerminalMaster, {
        flag: 'SELECT',
        store_code: storeData.id,
        pos_code: '',
        computer_description: ''
      }).then((result) => {
        var response: Array<PosTerminalModel> = result;
        if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
          this.viewBrandDataSource = new MatTableDataSource<PosTerminalModel>(response);
          this.viewBrandDataSource.paginator = this.first_paginator;
          this.viewBrandDataSource.sort = this.sort;
        } else {
          this.viewBrandDataSource = new MatTableDataSource<PosTerminalModel>([]);
          this.viewBrandDataSource.paginator = this.first_paginator;
          this.viewBrandDataSource.sort = this.sort;
          this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
        }
      }).catch(error => {
        this._toster.error(error, 'Error');
      }).finally(() => {
        this.loadding = false;
        this.selectedStoreByUser = storeData;
      });
    }
  }

  AddUpdatePosTerminalData(flag: string, update_data: PosTerminalModel) {
    if (!this.loadding) {
      const dialogRef = this.dialog.open(PristineConfirmDialogPOSTerminalComponent);
      dialogRef.componentInstance.confirmMessage = (flag == 'Add Pos Terminal') ? flag : flag + ' ( ' + update_data.pos_code + ' )';
      dialogRef.componentInstance.inputFieldMessage = 'Enter Coumputer Discription';
      dialogRef.componentInstance.inputemailMessage = 'Assign User ID';
      dialogRef.componentInstance.pass_update_email = update_data==null?'':update_data.assign_email;
      dialogRef.componentInstance.pass_update_computer_desc = update_data==null?'':update_data.computer_description;
      dialogRef.componentInstance.addbutton = (flag == 'Add Pos Terminal' ? 'Add' : 'Update');
      dialogRef.afterClosed().subscribe((result: PromiseResponse|any) => {
        if (result.condition == 'true') {
          this.loadding = true;
          this.webApiHttp.Post(this.webApiHttp.ApiURLArray.pos_InsertUpdateSelectDeletePOSTerminalMaster, {
            flag: (flag == 'Add Pos Terminal') ? 'INSERT' : 'UPDATE',
            pos_code: (flag == 'Add Pos Terminal') ? '' : update_data.pos_code,
            store_code: (flag == 'Add Pos Terminal') ? this.selectedStoreByUser.id : update_data.store_code,
            assign_email:result.email,
            computer_description: result.message
          }).then((result) => {
            var response: Array<PosTerminalModel> = result;
            if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
              this.viewBrandDataSource = new MatTableDataSource<PosTerminalModel>(response);
              this.viewBrandDataSource.paginator = this.first_paginator;
              this.viewBrandDataSource.sort = this.sort;
              this._toster.success(result.length > 0 ? result[0].message : result.message, 'Success');
            } else {
              this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
            }
          }).catch(error => {
            this._toster.error(error, 'Error');
          }).finally(() => {
            this.loadding = false;
          });

        }
      });
    }
  }


  delete_PosTerminal(element: PosTerminalModel) {
    if (!this.loadding) {
      var dialogConfig = this.dialog.open(pristineConfirmDialogComponent)
      dialogConfig.componentInstance.confirmMessage = 'You want to delete ' + element.pos_code + ' Pos Terminal';
      dialogConfig.afterClosed().subscribe(result => {
        if (result == true) {
          this.loadding = true;
          this.webApiHttp.Post(this.webApiHttp.ApiURLArray.pos_InsertUpdateSelectDeletePOSTerminalMaster,
            {
              flag: 'DELETE',
              store_code: element.store_code,
              pos_code: element.pos_code,
              computer_description: element.computer_description,
              assign_email:element.assign_email
            }).then(result => {
            if (isArray(result)) {
              let response: Array<PosTerminalModel> = result;
              if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
                this.viewBrandDataSource = new MatTableDataSource<PosTerminalModel>(response);
                this.viewBrandDataSource.paginator = this.first_paginator;
                this.viewBrandDataSource.sort = this.sort;
                this._toster.success(response[0].message, "Success");
              } else {
                this.viewBrandDataSource = new MatTableDataSource<PosTerminalModel>([]);
                this.viewBrandDataSource.paginator = this.first_paginator;
                this.viewBrandDataSource.sort = this.sort;
                this._toster.error(response.length > 0 ? response[0].message : "Response is not proper.", "Error");
              }
            } else this._toster.error(result.message, "Error");
          }).finally(() => {
            this.loadding = false;
          });
        }
      });
    }
  }

}

export class PosTerminalModel {
  condition: string;
  message:string;
  computer_description: string;
  pos_code: string;
  store_code: string;
  assign_email:string;
}


