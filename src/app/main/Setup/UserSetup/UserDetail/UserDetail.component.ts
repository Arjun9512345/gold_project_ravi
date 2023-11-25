import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {changeIPDialogComponent} from "../ChangeIP-dialog/ChangeIP-dialog.component";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {PristineConfirmDialogInputComponent} from "../../../../../@pristine/components/confirm-dialog-input/confirm-dialog-input.component";
import {MatDialog} from "@angular/material/dialog";
import {pristineAnimations} from "../../../../../@pristine/animations";
import {createUserDialogComponent} from "../CreateUser-dialog/CreateUser-dialog.component";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {PromiseResponse} from "../../../../modal/PromiseResponse";
import {ExcelService} from "../../../../../@pristine/process/excel.Service";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {StoreMasterListModel} from "../../../pos_master/pos_store/pos_store.component";

@Component({
  selector: 'UserDetail',
  templateUrl: './UserDetail.component.html',
  styleUrls: ['./UserDetail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: pristineAnimations
})
export class UserDetailComponent implements OnInit {

  dataSource: MatTableDataSource<UserDetailModel>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  store_code: string = '';
  storeMasterListModels: Array<StoreMasterListModel> = [];

  RebindLedger(store_code) {
    this.store_code = store_code;
    this.bindUserList();
  }

  constructor(private webapiHttp: WebApiHttp,
              public composeDialog: MatDialog,
              private pristineToaster: ToastrService,
              private spinner: NgxSpinnerService,
              public sessionManageMent: SessionManageMent,
              public excelService: ExcelService) {

  }

  applyFilter(filterValue: string, keyName: string) {
    this.dataSource.filter = filterValue;
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      if (data[keyName] != undefined && data[keyName] != null && data[keyName] != '') {
        return (data[keyName] != null && data[keyName] != undefined ? data[keyName].toString().toLowerCase() : '').includes(filter.toLowerCase());
      } else {
        return false;
      }
    };
  }

  displayedColumns: string[] = ['name', 'email', 'locationId', 'location_name', 'role_name', 'device_type', 'is_cluster', 'cluster_id', 'Password', 'Action'];
  pageSizeOptions: number[] = [10, 25, 100];

  ngOnInit(): void {
    this.spinner.show();

    if(this.sessionManageMent.getIsHo>0)
      this.store_code='All'
    else
      this.store_code = this.sessionManageMent.getLocationId;

    this.webapiHttp.Get(this.webapiHttp.ApiURLArray.pos_GetStoreLocationList + 'store').then(result => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        this.storeMasterListModels = result;
      }
    }).finally(() => {
      this.spinner.hide();
      this.bindUserList();
    });
  }


  bindUserList() {
    this.spinner.show();
    this.webapiHttp.Get(this.webapiHttp.ApiURLArray.GetAllUser + '?location_id=' + this.store_code)
      .then(result => {
        if (result[0].condition == 'True') {
          this.dataSource = new MatTableDataSource<UserDetailModel>(result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }else{
          this.dataSource = new MatTableDataSource<UserDetailModel>([]);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      }, error => {
        console.log(error)
      }).finally(() => {
      this.spinner.hide();
    });
  }

  AddUserDetail() {
    const dailogRef = this.composeDialog.open(createUserDialogComponent, {
      data: {
        flag: 'INSERT'
      },
      width: '600px'
    });
    dailogRef.afterClosed().subscribe(result => {
      this.bindUserList();
    })

  }

  NewEditUser(data1) {
    const dailogRef = this.composeDialog.open(createUserDialogComponent, {
      data: {
        flag: 'UPDATE',
        row: data1
      },
      width: '600px'
    });
    dailogRef.afterClosed().subscribe(result => {
      this.bindUserList();
    })
  }

  EditUser(data) {
    const dialogRef = this.composeDialog.open(PristineConfirmDialogInputComponent);
    dialogRef.componentInstance.inputFieldMessage = 'Enter New Password';
    dialogRef.componentInstance.confirmMessage = 'Change Password';
    dialogRef.componentInstance.addbutton = 'Update';
    dialogRef.afterClosed().subscribe((result: PromiseResponse) => {
      if (result.condition == 'true') {
        if (result.message.toString().length < 4) {
          this.pristineToaster.error('Please Enter Password Lenght minimum Four Digit.', 'Error');
          return;
        }
        const json = {
          Email: data.email,
          password: result.message
        };

        try {
          this.webapiHttp.Post(this.webapiHttp.ApiURLArray.UpdateUserPassword, json)
            .then(result => {
              let response: Array<{ condition: string; message: string }> = result;
              if (response[0].condition.toLowerCase() == 'true') {
                this.pristineToaster.success(response[0].message, 'Success');
                this.bindUserList();
              } else {
                this.pristineToaster.error(response[0].message, 'Error')
              }
            }, error => {
              console.log(error)
            })
        } catch (e) {
          console.log(e)
        }
      }
    })
  }

  downloadExcel() {
    for (let i = 0; i < this.dataSource.data.length; i++) {
      delete this.dataSource.data[i].condition
    }
    this.excelService.exportAsExcelFile(this.dataSource.data, 'UserData')
  }


}


export class UserDetailModel {
  barcode: string;
  condition: string;
  email: string;
  locationId: string;
  location_name: string;
  menu: string;
  message: string;
  name: string;
  password: string;
  pick: string;
  store_id: string;
  is_cluster:string;
  cluster_id:string;
}
