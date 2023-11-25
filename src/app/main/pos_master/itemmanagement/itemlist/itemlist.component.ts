import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {Router} from "@angular/router";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {Itemlist} from './itemlistmodel';
import {PaggingModel} from "../../../../modal/PaggingModel";


@Component({
  selector: 'app-itemlist',
  templateUrl: './itemlist.component.html',
  styleUrls: ['./itemlist.component.scss']
})
export class ItemlistComponent implements OnInit {

  displayedColumns: string[] = ['item_no', 'mid', 'name', 'description', 'sale_unit_of_measure',  'quantity', 'quantity_to_take','dual_gst','gst_group_name', 'hsn_code', 'View'];
  dataSource: MatTableDataSource<Itemlist> = new MatTableDataSource<Itemlist>([]);
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public sessionManageMent: SessionManageMent,
    public webApiHttp: WebApiHttp,
    private router: Router,
    private _encriptDecript: EncriptDecript,
    private _toster: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    try {
      let paggingData: PaggingModel = this.sessionManageMent.getItemPagging;
      if (paggingData != null && paggingData != undefined) {
        this.PageNumber = paggingData.page_number;
      }
    } catch (e) {

    }
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
        if (i == 0)
          query = ' Where [im].' + this.filter_dynamic[i].filterKey + " like '%" + this.filter_dynamic[i].filter_value + "%'" + (i == this.filter_dynamic.length - 1 ? '' : ' AND ')
        else
          query += ' [im].' + this.filter_dynamic[i].filterKey + " like '%" + this.filter_dynamic[i].filter_value + "%'" + (i == this.filter_dynamic.length - 1 ? '' : ' AND ')
      }
    }
    this.item_list(query);
  }

  length = 0;
  RowsPerPage = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  PageNumber = 0;


  clickOnRow(item_no: string) {
    var paggingData: PaggingModel = new PaggingModel();
    if (item_no == null || item_no == undefined || item_no == '') {
      paggingData = this.sessionManageMent.getItemPagging;
      if (paggingData == null || paggingData == undefined) {
        paggingData = new PaggingModel();
        paggingData.primary_value = item_no
        paggingData.page_number = this.PageNumber;
      }
    } else {
      paggingData.primary_value = item_no
      paggingData.page_number = this.PageNumber;
    }


    this.dataSource.data.map(item => {
      if ((item_no == item.mid || paggingData.primary_value == item.mid) && paggingData.page_number == this.PageNumber) {
        this.sessionManageMent.setItemPagging({
          primary_value: paggingData.primary_value,
          page_number: paggingData.page_number
        });
        item.highlighted = true;
      } else
        item.highlighted = false
    });
  }

  myPagginaterEvent(event) {
    this.RowsPerPage = event.pageSize;
    this.PageNumber = event.pageIndex;
    this.applyFilter('', '');
  }

  ngOnInit(): void {
    this.item_list('');
  }

  item_list(qery_parameter: string) {
    try {
      this.spinner.show();
      var json = {
        RowsPerPage: this.RowsPerPage,
        PageNumber: this.PageNumber,
        qery_parameter: qery_parameter,
        location_id: this.sessionManageMent.getLocationId
      }
      this.webApiHttp.Post(this.webApiHttp.ApiURLArray.ItemList, json).then(
        result => {
          if (result[0].condition == 'True') {
            this.length = result[0].total_rows;
            this.dataSource = new MatTableDataSource<Itemlist>(result);
            this.dataSource.sort = this.sort;
            this.clickOnRow('');
          } else {
            this.length = 0;
            this.dataSource = new MatTableDataSource<Itemlist>([]);
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


  viewinfo(element: Itemlist) {
    this.clickOnRow(element.mid);
    this.router.navigate(['/pos_master/itemlist/itemview', {res: element.item_no}])
  }


}
