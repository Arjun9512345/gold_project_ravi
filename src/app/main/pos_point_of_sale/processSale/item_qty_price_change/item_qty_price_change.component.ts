import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SaleOrderDetail} from "../processSale.component";
import {ToastrService} from "ngx-toastr";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {NgxSpinnerService} from "ngx-spinner";
import {Itemlist} from "../../../pos_master/itemmanagement/itemlist/itemlistmodel";
import {Router} from "@angular/router";

@Component({
  selector: 'app-item_qty_price_change',
  templateUrl: './item_qty_price_change.component.html',
  styleUrls: ['./item_qty_price_change.component.scss']
})
export class Item_qty_price_changeComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<Item_qty_price_changeComponent>,
              private _toster: ToastrService,
              private ngxSpinnerService: NgxSpinnerService,
              public webApiHttp: WebApiHttp,
              private router:Router,
              public sessionManageMent: SessionManageMent,
              @Inject(MAT_DIALOG_DATA) public data: PassData) {

  }

  select_count=1;
  previousImage(){
    this.select_count--;
    if(this.select_count==0)
      this.select_count=1;
    if(this.select_count==1)
      this.data.sale_order_header_line_list.image_url=this.data.sale_order_header_line_list.image_data.img1;
    if(this.select_count==2)
      this.data.sale_order_header_line_list.image_url=this.data.sale_order_header_line_list.image_data.img2;
    if(this.select_count==3)
      this.data.sale_order_header_line_list.image_url=this.data.sale_order_header_line_list.image_data.img3;
    if(this.select_count==4)
      this.data.sale_order_header_line_list.image_url=this.data.sale_order_header_line_list.image_data.img4;
  }
  nextImage(){
    this.select_count++;
    if(this.select_count>4)
      this.select_count=4;

    if(this.select_count==1)
      this.data.sale_order_header_line_list.image_url=this.data.sale_order_header_line_list.image_data.img1;
    if(this.select_count==2)
      this.data.sale_order_header_line_list.image_url=this.data.sale_order_header_line_list.image_data.img2;
    if(this.select_count==3)
      this.data.sale_order_header_line_list.image_url=this.data.sale_order_header_line_list.image_data.img3;
    if(this.select_count==4)
      this.data.sale_order_header_line_list.image_url=this.data.sale_order_header_line_list.image_data.img4;
  }
  ngOnInit() {
    this.qty = this.data.sale_order_header_line_list.qty;
  }


  viewinfo(item_no:string) {
    this.dialogRef.close();
    this.router.navigate(['/pos_master/itemlist/itemview', {res: item_no}])
  }
  close() {
    this.dialogRef.close();
  }

  qty: number = 0;
  async OnsubmitHit() {
    try {
      this.ngxSpinnerService.show();
      if(this.qty<0){
        this._toster.error('Quantity is greater than and equal to zero.')
        return ;
      }
      if (this.data.sale_order_header_line_list.qty < this.qty) {
        let actual_qty=this.qty - this.data.sale_order_header_line_list.qty;
        if(actual_qty<=0){
          this._toster.error('Quantity is greater than zero.')
          return ;
        }
        await this.webApiHttp.Post(this.webApiHttp.ApiURLArray.pos_sale_barcode_scan, {
          so_no: this.data.sale_order_header_line_list.sale_header_no,
          barcode: this.data.sale_order_header_line_list.barcode,
          qty: actual_qty,
          email_id: this.sessionManageMent.getEmail,
          store_id: this.sessionManageMent.getLocationId
        }).then(result => {
          if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
            var response: any = result[0].sale_data;
            if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {

            } else {
              this._toster.error(response.length > 0 ? response[0].message : response.message, 'Error');
            }
          } else {
            this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
          }
        }).catch(error => {

        }).finally(() => {

        });
      }
      if (this.data.sale_order_header_line_list.qty > this.qty) {
        let actual_qty=this.data.sale_order_header_line_list.qty - this.qty;
        if(actual_qty<=0){
          this._toster.error('Quantity is greater than zero.')
          return ;
        }
        await this.webApiHttp.Post(this.webApiHttp.ApiURLArray.pos_sale_barcode_delete,
          {
            so_no: this.data.sale_order_header_line_list.sale_header_no,
            barcode: this.data.sale_order_header_line_list.barcode,
            qty: this.data.sale_order_header_line_list.qty - this.qty,
            email_id: this.sessionManageMent.getEmail,
            store_id: this.sessionManageMent.getLocationId
          }).then(result => {
          if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
            var response: any = result[0].sale_data;
            if (response.length > 0 && response[0].condition.toLowerCase() == 'true') {

            } else {
              this._toster.error(response.length > 0 ? response[0].message : response.message, 'Error');
            }
          } else {
            this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
          }
        }).finally(() => {
        });
      }
    } catch (e) {

    } finally {
      this.ngxSpinnerService.hide();
      this.dialogRef.close(true);
    }

  }

}

interface PassData {
  flag: string;
  sale_order_header_line_list: SaleOrderDetail;
}
