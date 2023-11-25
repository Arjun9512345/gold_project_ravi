import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {StoreMasterListModel} from "../../pos_store/pos_store.component";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-add_cluster_mst_popup',
  templateUrl: './add_cluster_mst_popup.component.html',
  styleUrls: ['./add_cluster_mst_popup.component.scss']
})
export class Add_cluster_mst_popupComponent implements OnInit {
  selected_location_list: Array<{ location_name: string, location_id: string }> = [];
  store_code: string = '';
  storeMasterListModels: Array<StoreMasterListModel> = [];
  cluster_name: string = '';

  addLocation_data() {
    if (this.selected_location_list.filter(item => item.location_id == this.store_code).length <= 0) {
      this.selected_location_list.push({
        location_name: this.storeMasterListModels.filter(item => item.id == this.store_code)[0].name,
        location_id: this.store_code
      });
    } else {
      this._toster.error('You Already Added This Location.')
    }
  }

  constructor(public dialogRef: MatDialogRef<Add_cluster_mst_popupComponent>,
              private _toster: ToastrService,
              private _sessionManageMent: SessionManageMent,
              private  webApiHttp: WebApiHttp,
              private ngxSpinnerService: NgxSpinnerService,
              private sessionManageMent:SessionManageMent,
              @Inject(MAT_DIALOG_DATA) public data: PassData) {
    this.webApiHttp.Get(this.webApiHttp.ApiURLArray.pos_GetStoreLocationList + 'store').then(result => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        this.storeMasterListModels = result;
      }
    });

  }

  today = new Date();

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

  submit_clusterMaster() {
    if (this.cluster_name == null || this.cluster_name == undefined || this.cluster_name == '') {
      this._toster.error('Please Enter Cluster Name.');
      return;
    }
    if (this.selected_location_list.length <= 0) {
      this._toster.error('Please Add Minimum One Location.');
      return;
    }
    var list: Array<{ email_id: string, name: string; location_id: string; }> = [];
    for (let item of this.selected_location_list) {
      list.push({email_id: this._sessionManageMent.getEmail, name: this.cluster_name, location_id: item.location_id});
    }
    var json = {
      flag: "INSERT",
      clusterlist: list
    };
    this.ngxSpinnerService.show();
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.InsertClusterMaster, json).then(response => {
      if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
        this.dialogRef.close(response);
      } else {
        this._toster.error(response.length > 0 ? response[0].message : response.message, "Error");
      }
    }).catch(err => {
      this._toster.error(err, 'Error');
    }).finally(() => {
      this.ngxSpinnerService.hide();
    })
  }

}

interface PassData {
  flag: string;
  saleReturnData: Array<any>;
  header_no: string;
}
