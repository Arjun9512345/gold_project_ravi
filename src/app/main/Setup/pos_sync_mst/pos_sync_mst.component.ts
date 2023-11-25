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
import {pristineConfirmDialogComponent} from "../../../../@pristine/components/confirm-dialog/confirm-dialog.component";
import {ExcelService} from "../../../../@pristine/process/excel.Service";

@Component({
  selector: 'app-POSTerminalMaster',
  templateUrl: './pos_sync_mst.component.html',
  styleUrls: ['./pos_sync_mst.component.scss']
})
export class Pos_sync_mstComponent implements OnInit {

  displayedColumns: string[] = ['id', 'process_type', 'document_no','hit_count','push_xml','response_xml','response_on','response_message', 'Action'];
  viewBrandDataSource: MatTableDataSource<NavSyncModel> = new MatTableDataSource<NavSyncModel>();
  @ViewChild('first_paginator', {static: true}) first_paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  loadding: boolean = false;

  constructor(public sessionManageMent: SessionManageMent,
              public webApiHttp: WebApiHttp,
              private _formBuilder: FormBuilder,
              private _toster: ToastrService,
              private router: Router,
              private encriptDecript: EncriptDecript,
              private excel_serive:ExcelService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
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

  selected_flag_by_user:string='';

  getPosTerminalViewList(flag:string) {
    this.selected_flag_by_user=flag;
    if (!this.loadding) {
      this.loadding = true;
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetSyncProcessGetData+this.selected_flag_by_user).then((result) => {
        var response: Array<NavSyncModel> = result;
        if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
          this.viewBrandDataSource = new MatTableDataSource<NavSyncModel>(response);
          this.viewBrandDataSource.paginator = this.first_paginator;
          this.viewBrandDataSource.sort = this.sort;
        } else {
          this.viewBrandDataSource = new MatTableDataSource<NavSyncModel>([]);
          this.viewBrandDataSource.paginator = this.first_paginator;
          this.viewBrandDataSource.sort = this.sort;
          this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
        }
      }).catch(error => {
        this._toster.error(error, 'Error');
      }).finally(() => {
        this.loadding = false;
      });
    }
  }

  DownloadExcel() {
    this.excel_serive.MultisheetWorkbook([this.viewBrandDataSource.data],['NavHitPending'],'NavHitPending')
  }


  hitToNavAgain(element: NavSyncModel) {
    if (!this.loadding) {
      var dialogConfig = this.dialog.open(pristineConfirmDialogComponent)
      dialogConfig.componentInstance.confirmMessage = 'You want to resend this document?';
      dialogConfig.afterClosed().subscribe(result => {
        if (result == true) {
          this.loadding = true;
          this.webApiHttp.Post(this.webApiHttp.ApiURLArray.NavPostSyncProcess,
            {
              flag: this.selected_flag_by_user,
              id: element.id,
              process_type: element.process_type,
              xml: element.push_xml,
            }).then(result => {
            if (isArray(result)) {
              let response: Array<NavSyncModel> = result;
              if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
                this._toster.success(response[0].message, "Success");
              } else {
                this._toster.error(response.length > 0 ? response[0].message : "Response is not proper.", "Error");
              }
            } else this._toster.error(result.message, "Error");
          }).finally(() => {
            this.loadding = false;
            this.getPosTerminalViewList(this.selected_flag_by_user);
          });
        }
      });
    }
  }
  copyText(text:string){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this._toster.success('Copy Text','Copy')
  }
}

export class NavSyncModel {
  condition: string;
  message:string;
  id: number;
  transfer_order_type: string;
  process_type: string;
  document_no:string;
  receipt_no:string;
  push_xml:string;
  response_message:string;
  hit_count:string;
  response_on:string;
}


