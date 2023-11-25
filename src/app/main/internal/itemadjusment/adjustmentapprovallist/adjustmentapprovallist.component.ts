import {Component, OnInit, ViewChild} from '@angular/core';
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {Router} from "@angular/router";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {FormBuilder} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {PaggingModel} from "../../../../modal/PaggingModel";

@Component({
  selector: 'app-adjustmentlist',
  templateUrl: './adjustmentapprovallist.component.html',
  styleUrls: ['./adjustmentapprovallist.component.scss']
})

export class AdjustmentapprovallistComponent implements OnInit {

  displayedColumns: string[] = ['adjustment_no', 'adj_type', 'approval_status', 'created_by', 'created_on', 'View'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  length = 0;
  RowsPerPage = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  PageNumber = 0;
  filter_dynamic: Array<{ filterKey: string, filter_value: string }> = [];


  constructor(public sessionManageMent: SessionManageMent,
              private webApiHttp: WebApiHttp,
              private router: Router,
              private _encriptDecript: EncriptDecript,
              private _toster: ToastrService,
              private spinner: NgxSpinnerService,
              private _bulder: FormBuilder) {
    try {
      let paggingData: PaggingModel = this.sessionManageMent.getItemPagging;
      if (paggingData != null) {
        this.PageNumber = paggingData.page_number;
      }
    } catch (e) {

    }
  }


  ngOnInit(): void {
    this.adjustment_list("and ah.approval_status = 'Pending for Approval'");
  }

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
        if (i == 0)
          query = " and ah.approval_status = 'Pending for Approval' and [ah]." + this.filter_dynamic[i].filterKey + " like '%" + this.filter_dynamic[i].filter_value + "%'" + (i == this.filter_dynamic.length - 1 ? '' : ' AND ')
        else
          query += ' [ah].' + this.filter_dynamic[i].filterKey + " like '%" + this.filter_dynamic[i].filter_value + "%'" + (i == this.filter_dynamic.length - 1 ? '' : ' AND ')
      }
    }
    this.adjustment_list(query);
  }

  myPagginaterEvent(event) {
    this.RowsPerPage = event.pageSize;
    this.PageNumber = event.pageIndex;
    this.applyFilter('', '');
  }

  adjustment_list(qery_parameter: string) {
    try {
      this.spinner.show();
      var json = {
        RowsPerPage: this.RowsPerPage,
        PageNumber: this.PageNumber,
        qery_parameter: qery_parameter,
        location_id: this.sessionManageMent.getLocationId
      }
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.DocumentList, json).then(
        result => {
          if (result[0].condition == 'True') {
            this.length = result[0].total_rows;
            this.dataSource = new MatTableDataSource<any>(result);
            this.dataSource.sort = this.sort;
          } else {
            this.length = 0;
            this.dataSource = new MatTableDataSource<any>([]);
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

  start_adjustment(type: string = '', element: any = '') {
    this.router.navigate(['/internal/adjuestmentwork',
      {res: this._encriptDecript.encrypt('{"action": "' + type + '","DocumentNo":"' + element.adjustment_no + '"}')}])
  }

}
