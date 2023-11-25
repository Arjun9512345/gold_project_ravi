import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {AllRoleModel} from "../../../../modal/UserSetupModel";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {StoreMasterListModel} from "../../../pos_master/pos_store/pos_store.component";
import {NgxSpinnerService} from "ngx-spinner";
import {ClusterListModel} from "../../../pos_master/cluster_mst/cluster_mst.component";

@Component({
  selector: 'CreateUser-dialog-dialog',
  templateUrl: './CreateUser-dialog.component.html',
  styleUrls: ['./CreateUser-dialog.component.scss']
})
export class createUserDialogComponent implements OnInit {
  public confirmMessage: string;
  registerForm: FormGroup;
  loading: boolean = false;
  AllRoleDetail: Array<AllRoleModel> = [];
  storeMasterListModels: Array<StoreMasterListModel> = [];

  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<createUserDialogComponent>,
    private webApiHttp: WebApiHttp,
    private ngxSpinnerService: NgxSpinnerService,
    private pristineToaster: ToastrService,
    private sessionManageMent: SessionManageMent,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.registerForm = this._formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required]],
      roll_id: ['', [Validators.required]],
      password: [''],
      store_code: ['', Validators.required],
      passwordConfirm: [''],
      device_type: ['', Validators.required],
      is_ho: [false],
    });

  }

  cluster_listData: Array<ClusterListModel> = [];

  bindClusterList() {
    if (this.cluster_listData.length > 0)
      this.ngxSpinnerService.show();
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.InsertClusterMaster, {
      flag: 'SELECT',
      clusterlist: []
    }).then((result) => {
      var response: Array<ClusterListModel> = result;
      this.cluster_listData = result;
    }).catch(error => {
      this.pristineToaster.error(error, 'Error');
    }).finally(() => {
      this.ngxSpinnerService.hide();
    });
  }

  ngOnInit(): void {

    if (this.data.flag == "UPDATE") {
      this.registerForm.get('name').setValue(this.data.row.name);
      this.registerForm.get('email').setValue(this.data.row.email);
      this.registerForm.get('email').disable();
      this.registerForm.get('roll_id').setValue(this.data.row.roleId);
      this.registerForm.get('passwordConfirm').setValue(this.data.row.password);
      this.registerForm.get('passwordConfirm').disable();
      this.registerForm.get('device_type').setValue(this.data.row.device_type);

      if(this.data.row.is_cluster>0){
        this.registerForm.get('is_ho').setValue(this.data.row.is_cluster);
        this.registerForm.get('store_code').setValue(this.data.row.cluster_id);
        this.registerForm.get('store_code').disable();
        this.bindClusterList();
      }else{
        this.registerForm.get('store_code').setValue(this.data.row.locationId);
        this.registerForm.get('store_code').disable();
      }

      this.registerForm.get('is_ho').disable();
    }

    const json = {
      flag: 'select'
    };
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.roleProcess, json)
      .then(result => {
        this.AllRoleDetail = result as AllRoleModel[]
      }, error => {
        console.log(error)
      }).finally(() => {
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.pos_GetStoreLocationList + 'store').then(result => {
        if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
          this.storeMasterListModels = result;
        }
      });
    })

  }


  CreateUser() {
    if (this.registerForm.get('password').value.toString().length < 4) {
      this.pristineToaster.error('Please Enter Password Lenght minimum Four Digit.', 'Error');
      return;
    }
    if (this.registerForm.get('password').value.toString() !=
      this.registerForm.get('passwordConfirm').value.toString()) {
      this.pristineToaster.error('Password Does Not Match.', 'Error');
      return;
    }

    const json = {
      Name: this.registerForm.get('name').value,
      Email: this.registerForm.get('email').value,
      password: this.registerForm.get('password').value,
      roleId: this.registerForm.get('roll_id').value,
      locationId: this.registerForm.get('store_code').value,
      device_type: this.registerForm.get('device_type').value,
      is_ho: this.registerForm.get('is_ho').value?1:0
    };

    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.CreateUser, json)
      .then(result => {
        let response: Array<{ condition: string; message: string }> = result;
        if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
          this.dialogRef.close();
          this.pristineToaster.success('User created Successfully', 'Success',)
        } else {
          this.pristineToaster.error(response[0].message, 'Error')
        }
      }, error => {
        console.log(error)
      })
  }

  UpdateUser() {

    const json = {
      name: this.registerForm.get('name').value,
      Email: this.registerForm.get('email').value,
      roleId: this.registerForm.get('roll_id').value,
      device_type: this.registerForm.get('device_type').value,
      locationId: this.registerForm.get('store_code').value,
    };
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.UpdateUser, json)
      .then(result => {
        let response: Array<{ condition: string; message: string }> = result;
        if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
          this.dialogRef.close();
          this.pristineToaster.success('User update Successfully', 'Success',)
        } else {
          this.pristineToaster.error(response[0].message, 'Error')
        }
      }, error => {
        console.log(error)
      })
  }

  cancle() {
    this.dialogRef.close();
  }

}

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

  if (!control.parent || !control) {
    return null;
  }

  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('passwordConfirm');

  if (!password || !passwordConfirm) {
    return null;
  }
  if (passwordConfirm.value === '') {
    return null;
  }
  if (password.value === passwordConfirm.value) {
    return null;
  }
  return {passwordsNotMatching: true};
};
