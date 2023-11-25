import {Component, OnInit, ViewChild} from '@angular/core';
import {WebApiHttp} from "../../../../../../@pristine/process/WebApiHttp.services";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {SessionManageMent} from "../../../../../../@pristine/process/SessionManageMent";
import {EncriptDecript} from "../../../../../../@pristine/process/EncriptDecript";
import {NgxSpinnerService} from "ngx-spinner";
import {BarcodeImageModel, Itemviewmodel} from "./itemviewmodel";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {BarcodelistComponent} from "../../../barcodelist/barcodelist.component";
import {MatDialog} from "@angular/material/dialog";
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {MatMenuPanel} from "@angular/material/menu/menu-panel";

@Component({
  selector: 'app-itemview',
  templateUrl: './itemview.component.html',
  styleUrls: ['./itemview.component.scss']
})
export class ItemviewComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  type: string
  iteminfo: Itemviewmodel[] = [];
  viewbarcode(data) {
    this.dialog.open(BarcodelistComponent, {width: "800px", data});
  }
  constructor(
    private webApiHttp: WebApiHttp,
    private _toster: ToastrService,
    private  router: Router,
    private _encriptDecript: EncriptDecript,
    public sessionManageMent: SessionManageMent,
    private  route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog) {
  }

  clickOnitemView(barcode){
    this.router.navigate(['/pos_master/item_ledger_entry_list', {res: barcode}])
  }
  ngOnInit(): void {
    this.type = this.route.snapshot.paramMap.get('res')
    this.item_nfo();
  }

  item_nfo() {
    this.spinner.show();
    const json = {
      item_no: this.type,
      email_id: this.sessionManageMent.getEmail
    }
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.ItemFullInfo, json).then(result => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        this.iteminfo = result;
        if(this.iteminfo[0].so_data!=null && this.iteminfo[0].so_data!=undefined && this.iteminfo[0].so_data!='')
          this.iteminfo[0].so_data=JSON.parse(this.iteminfo[0].so_data);
        else this.iteminfo[0].so_data=[];

        if(this.iteminfo[0].to_data!=null && this.iteminfo[0].to_data!=undefined && this.iteminfo[0].to_data!='')
          this.iteminfo[0].to_data=JSON.parse(this.iteminfo[0].to_data);
        else this.iteminfo[0].to_data=[];

        this.GetImage(this.iteminfo[0].mid);
      } else {
        this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
      }
    }).catch(err => {
    }).finally(() => {
      this.spinner.hide();
    })
  }

  image_data: BarcodeImageModel = null;

  GetImage(barcode: string) {
    this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetImage + barcode).then(
      result => {
        if (result.hasOwnProperty('img1')) {
          this.image_data = result;
          this.image_data.selected_image=  this.image_data.img1;
        }
      }).catch(err => {
    }).finally(() => {
    });
  }

}
