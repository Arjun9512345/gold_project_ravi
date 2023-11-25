import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {ToastrService} from 'ngx-toastr';
import {WebApiHttp} from '../../../../../@pristine/process/WebApiHttp.services';
import {SessionManageMent} from '../../../../../@pristine/process/SessionManageMent';
import {NgxSpinnerService} from "ngx-spinner";
import {Itemlist} from "../../../pos_master/itemmanagement/itemlist/itemlistmodel";
import {MatSort} from "@angular/material/sort";
import {Router} from "@angular/router";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
@Component({
  selector: 'app-cycle_count_list',
  templateUrl: './cycle_count_list.component.html',
  styleUrls: ['./cycle_count_list.component.scss']
})
export class Cycle_count_listComponent implements OnInit {
  displayedColumns: string[] = ['document_type', 'document_no', 'location_id', 'status', 'completed_on', 'total_qty','total_items','total_approve_qty', 'View'];
  dataSource: MatTableDataSource<CycleCountListModel> = new MatTableDataSource<CycleCountListModel>([]);
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public sessionManageMent: SessionManageMent,
    public webApiHttp: WebApiHttp,
    private router: Router,
    private _encriptDecript: EncriptDecript,
    private _toster: ToastrService,
    private spinner: NgxSpinnerService
  ) {

  }

  filter_dynamic: Array<{ filterKey: string, filter_value: string }> = [];

  applyFilter(filterValue: string, keyName: string) {
    if (filterValue == '') {
      for (let i = 0; i < this.filter_dynamic.length; i++) {
        if (this.filter_dynamic[i].filterKey == keyName && filterValue == '') {
          this.filter_dynamic.splice(i, 1);
          break;
        }
      }
    }
    if (keyName != '' && filterValue != '') {
      let validate: boolean = false;
      Array.from(this.filter_dynamic).forEach(item => {
        if (item.filterKey == keyName) {
          item.filter_value = filterValue;
          validate = true;
        }
      });
      if (!validate) {
        this.filter_dynamic.push({filterKey: keyName, filter_value: filterValue});
      }
    }
    let query = '';
    for (let i = 0; i < this.filter_dynamic.length; i++) {
      if (this.filter_dynamic[i].filter_value != '') {
          query += (query!=''?"___":'')+this.filter_dynamic[i].filter_value;
      }
    }
    this.cyclecount_list(query);
  }

  length = 0;
  RowsPerPage = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  PageNumber = 0;




  myPagginaterEvent(event) {
    this.RowsPerPage = event.pageSize;
    this.PageNumber = event.pageIndex;
    this.applyFilter('', '');
  }

  ngOnInit(): void {
    this.cyclecount_list('');
  }

  cyclecount_list(qery_parameter: string) {
    try {
      this.spinner.show();
      var json = {
        RowsPerPage: this.RowsPerPage,
        PageNumber: this.PageNumber,
        line_barcode_filter: qery_parameter,
        location_id: this.sessionManageMent.getLocationId,
        email_id:this.sessionManageMent.getEmail
      }
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.GetCycleCountList, json).then(
        result => {
          if (result[0].condition == 'True') {
            this.length = result[0].total_rows;
            this.dataSource = new MatTableDataSource<CycleCountListModel>(result);
            this.dataSource.sort = this.sort;
          } else {
            this.length = 0;
            this.dataSource = new MatTableDataSource<CycleCountListModel>([]);
            this.dataSource.sort = this.sort;
          }
          this.spinner.hide();
          return;
          //console.log(this.dataSource);
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


  viewinfo(element: CycleCountListModel) {
    this.router.navigate(['/internal/pos_cycle_count', {res: this._encriptDecript.encrypt(element.document_no) }])
  }

}

export class CycleCountListModel {
  condition: string;
  message:string;
  total_rows:number;
  document_type:string;
  document_no:string;
  location_id:string;
  created_on:string;
  created_by:string;
  status:string;
  completed_on:string;
  is_approved:string;
  approval_id:string;
  approve_on:string;
  total_qty:number;
  total_items:number;
}





