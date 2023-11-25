import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {WebApiHttp} from "../../../../../../../@pristine/process/WebApiHttp.services";
import {EncriptDecript} from "../../../../../../../@pristine/process/EncriptDecript";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";


@Component({
  selector: 'change-password-dialog',
  templateUrl: './itemsubcategorycreation.component.html',
  styleUrls: ['./itemsubcategorycreation.component.scss']
})
export class itemsubcategorycreationComponent implements OnInit {
  itemcategory: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<itemsubcategorycreationComponent>,
    private spinner: NgxSpinnerService,
    public webApiHttp: WebApiHttp,
    public _encryptdecrypt: EncriptDecript,
    private  router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _toasterService: ToastrService
  ) {

    this.itemcategory = this.fb.group({
      catcode: [null, Validators.required],
      description: [null],
      itemname: [null, Validators.required],
    })
  }


  ngOnInit(): void {
    if (this.data.flag == 'update') {
      this.itemcategory.get("catcode").setValue(this.data.category.code)
      this.itemcategory.get("catcode").disable()
      this.itemcategory.get("itemname").setValue(this.data.category.name)
      this.itemcategory.get("description").setValue(this.data.category.description)

    }
  }

  CreateItemCategory() {
    var json: any
    if (this.data.flag == 'update') {
      json = {
        code: this.itemcategory.get("catcode").value,
        name: this.itemcategory.get("itemname").value,
        description: this.itemcategory.get("description").value,
        SubId: this.data.id,
        flag: 'update',
        created_by: '',
        updated_by: this._encryptdecrypt.decrypt(localStorage.getItem('ZV_SSID'))
      }
    } else {
      json = {
        code: this.itemcategory.get("catcode").value,
        name: this.itemcategory.get("itemname").value,
        description: this.itemcategory.get("description").value,
        SubId: this.data.id,
        flag: 'Insert',
        created_by: this._encryptdecrypt.decrypt(localStorage.getItem('ZV_SSID')),
        updated_by: ''
      }
    }
    try {
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.ItemCategoryCreate, json)
        .then(result => {
          if (result[0].condition.toLowerCase() == 'true') {
            this._toasterService.success('success', result[0].message)
            this.dialogRef.close('true');
          } else {
            this._toasterService.error('error', result[0].message)
            this.dialogRef.close('true');
          }
        }, error => {
          this._toasterService.error('error', error)
        })
    } catch (e) {
      this._toasterService.error('error', e)
    }
  }

  cancle() {
    this.dialogRef.close('true')
  }


}
