import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {WebApiHttp} from '../../../../@pristine/process/WebApiHttp.services';
import {SessionManageMent} from '../../../../@pristine/process/SessionManageMent';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {StoreMasterListModel} from "../pos_store/pos_store.component";
import {MatDialog} from "@angular/material/dialog";
import {Add_cluster_mst_popupComponent} from "./add_cluster_mst_popup/add_cluster_mst_popup.component";


@Component({
  selector: 'app-product_brand',
  templateUrl: './cluster_mst.component.html',
  styleUrls: ['./cluster_mst.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class Cluster_mstComponent implements OnInit {

  async selected_Row(element: ClusterListModel) {

    element.Action = !element.Action;
  }

  step = 0;

  setStep(index: number) {
    this.step = index;
  }


  cluster_listData: Array<ClusterListModel> = [];

  loadding: boolean = false;

  constructor(public sessionManageMent: SessionManageMent,
              public webApiHttp: WebApiHttp,
              private _formBuilder: FormBuilder,
              private _toster: ToastrService,
              private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.GetClusterMaster();
  }


  GetClusterMaster() {
    this.loadding = true;
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.InsertClusterMaster, {
      flag: 'SELECT',
      clusterlist: []
    }).then((result) => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        this.cluster_listData = result;
      }
    }).catch(error => {
      this._toster.error(error, 'Error');
    }).finally(() => {
      this.loadding = false;
    });
  }

  AddStoreList(flag: string, passdata: StoreMasterListModel) {

    const dialogRef = this.dialog.open(Add_cluster_mst_popupComponent, {
      data: {
        flag: flag,
        store_Data: passdata
      }, width: '600px'
    });
    dialogRef.afterClosed().subscribe((response: Array<StoreMasterListModel>) => {
      if (response) {
        if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {
          this._toster.success(response[0].message, "Success");
          this.GetClusterMaster();
        }
      }
    });
  }


}

export class ClusterListModel {
  condition: string;
  message: string;
  cluster_name: string;
  Action: boolean;
  cm: Array<ClusterLocationListModel>;
}

export class ClusterLocationListModel {
  location_id: string;
  created_on: string;
  created_by: string;
  lm:Array<{location_name:string}>;
}



