import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SaleOrderDetail} from "../processSale.component";
import {ToastrService} from "ngx-toastr";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {NgxSpinnerService} from "ngx-spinner";
import {Itemlist} from "../../../pos_master/itemmanagement/itemlist/itemlistmodel";
import {Router} from "@angular/router";
import {BarcodeImageModel} from "../../../pos_master/itemmanagement/itemlist/itemview/itemviewmodel";

@Component({
  selector: 'app-item_qty_price_change',
  templateUrl: './customer_history_items.component.html',
  styleUrls: ['./customer_history_items.component.scss']
})
export class Customer_history_itemsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<Customer_history_itemsComponent>,
              private _toster: ToastrService,
              private ngxSpinnerService: NgxSpinnerService,
              public webApiHttp: WebApiHttp,
              private router:Router,
              public sessionManageMent: SessionManageMent,
              @Inject(MAT_DIALOG_DATA) public data: PassData) {

  }

  ngOnInit() {
    this.ngxSpinnerService.show();
    this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetCustomerHistory+this.data.customer_id).then(result => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        this.customer_history_data=result;
        this.getImageUrl();
      } else {
        this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
      }
    }).catch(error => {

    }).finally(() => {
      this.ngxSpinnerService.hide();
    });
  }

  getImageUrl(){
    this.customer_history_data.map(async item=>{
      await this.webApiHttp.Get(this.webApiHttp.ApiURLArray.GetImage+item.barcode).then((result:BarcodeImageModel)=>{
        item.image_data= result;
        item.image_url=result.img1;
      })
    });
  }


  close() {
    this.dialogRef.close();
  }

  customer_history_data:Array<{
    condition:string;
    item_no:string;
    name:string;
    barcode:string;
    qty:string;
    image_url:string;
    image_data:BarcodeImageModel;
  }>=[];


}

interface PassData {
  flag: string;
  customer_id:string;
  cust_name:string;
  cust_mobile_no:string;
}
