import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SessionManageMent} from '../../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../../@pristine/process/WebApiHttp.services';
import {Router} from '@angular/router';
import {EncriptDecript} from '../../../../../@pristine/process/EncriptDecript';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-receivetransferorderlist',
  templateUrl: './receivetransferorderlist.component.html',
  styleUrls: ['./receivetransferorderlist.component.scss']
})
export class ReceivetransferorderlistComponent implements OnInit {

  displayedColumns: string[] = ['document_no','shipment_no', 'from_location','from_location_id', 'to_location','to_location_id', 'order_status',
    'total_quantity','total_transfer_cost','total_gst_amount','total_transfer_cost_with_gst', 'total_quantity_shipped',
    'total_quantity_received','created_date','created_by','ship_date','shipped_by', 'Action'];
  dataSource: MatTableDataSource<any>;
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
    this.receive_order_transfer_list();
  }


  receive_order_transfer_list() {
    try {
      this.spinner.show();
      const json = {
        LocationId: this.sessionManageMent.getLocationId,
        flag:'GetReceivedOrder'
      }
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.InboundList, json).then(
        result => {
          if (result[0].condition == 'True') {
            this.dataSource = new MatTableDataSource<any>(result);
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
    this.router.navigate(['/ordermanagement/transfer_receive_by_user', {
      response: this._encriptDecript.encrypt(JSON.stringify({
        doc_no:document_no,
        type:'Receive'
      }))
    }]);
  }


}
