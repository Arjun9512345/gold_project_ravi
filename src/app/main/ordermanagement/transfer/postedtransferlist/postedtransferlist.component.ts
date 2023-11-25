import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {Component, OnInit, ViewChild} from "@angular/core";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-transferlist',
  templateUrl: './postedtransferlist.component.html',
  styleUrls: ['./postedtransferlist.component.scss']
})
export class PostedtransferlistComponent implements OnInit {

  displayedColumns: string[] = ['document_no','shipment_no', 'from_location','from_location_id', 'to_location','to_location_id', 'order_status',
    'total_quantity','total_transfer_cost','total_gst_amount','total_transfer_cost_with_gst', 'total_quantity_shipped',
    'total_quantity_received','total_shortage','created_date','created_by','ship_date','shipped_by', 'Action'];
  dataSource: MatTableDataSource<TransferOrderList>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public sessionManageMent: SessionManageMent,
    private webApiHttp: WebApiHttp,
    private router: Router,
    private _encriptDecript: EncriptDecript,
    private _toster: ToastrService,
    private spinner: NgxSpinnerService,
  ) {

  }

  ngOnInit(): void {
    this.transfer_list(this.sessionManageMent.getLocationId);
  }


  transfer_list(location_id:string) {
    try {
      this.spinner.show();
      const json = {
        LocationId: location_id,
        flag:'Transfer Posted'
      }
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.InboundList, json).then(
        result => {
          if (result[0].condition == 'True') {
            this.dataSource = new MatTableDataSource<TransferOrderList>(result);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          } else {
            this._toster.warning(result[0].message, 'Message');
          }
          this.spinner.hide();
          return;
        }
      ).catch(e => {
        this.spinner.hide();
        this._toster.error(e, 'Error');
      })
    } catch (e) {
      this.spinner.hide();
      this._toster.error(e, 'Error');
    }
  }

  applyFilter(filterValue: string, keyName: string) {
    this.dataSource.filter = filterValue;
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      if (data[keyName] != undefined && data[keyName] != null && data[keyName] != '') {
        return (data[keyName] != null && data[keyName] != undefined ? data[keyName].toString().toLowerCase() : '').includes(filter.toLowerCase());
      } else {
        return false
      }
    };
  }


  viewinfo(document_no: any) {
    this.router.navigate(['/ordermanagement/transfercreate', {
      response: this._encriptDecript.encrypt(JSON.stringify({
        doc_no:document_no,
        type:'view'
      }))
    }]);
  }



}

export class TransferOrderList {
  condition: string;
  created_by: string;
  created_date: string;
  document_no: string;
  from_location: string;
  order_status: string;
  to_location: string;
  total_gst_amount: string;
  total_quantity: string;
  total_quantity_received: string;
  total_quantity_shipped: string;
  total_transfer_cost: string;
  total_transfer_cost_with_gst: string;
}
