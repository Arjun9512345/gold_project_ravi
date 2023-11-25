import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {EncriptDecript} from "../../../../@pristine/process/EncriptDecript";
import {StoreMasterListModel} from "../pos_store/pos_store.component";
import {ExcelService} from "../../../../@pristine/process/excel.Service";


@Component({
  selector: 'app-itemlist',
  templateUrl: './item_ledger_entry_list.component.html',
  styleUrls: ['./item_ledger_entry_list.component.scss']
})
export class Item_ledger_entry_listComponent implements OnInit {

  displayedColumns: string[] = ['ile_no', 'document_no', 'document_type', 'item_no', 'barcode', 'location_id', 'location_name', 'quantitiy', 'created_on', 'created_by'];
  dataSource: MatTableDataSource<ItemLedgerModel> = new MatTableDataSource<ItemLedgerModel>([]);
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  store_code: string = '';
  storeMasterListModels: Array<StoreMasterListModel> = [];

  RebindLedger(store_code) {
    this.store_code = store_code;
    this.applyFilter('', '');
  }


  download_Excel(location_id,barcode,start_date,end_date) {
    this.spinner.show();
    this.webApiHttp.Get(this.webApiHttp.ApiURLArray.ExcelItemLedgerList + location_id + '&barcode=' + barcode+'&start_date='+start_date+'&end_date='+end_date).then(result => {
     if(result.length>0 && result[0].condition.toLowerCase()=='true')
      this.excelService.exportAsExcelFile(result, 'ledgerReport');
     else
       this._toster.error('Record Not Found.', 'Error');
    }).finally(() => {
      this.spinner.hide();
    })
  }

  constructor(
    public sessionManageMent: SessionManageMent,
    public webApiHttp: WebApiHttp,
    private router: Router,
    private _encriptDecript: EncriptDecript,
    private _toster: ToastrService,
    private spinner: NgxSpinnerService,
    private  route: ActivatedRoute,
    private excelService: ExcelService
  ) {
    if(this.sessionManageMent.getIsHo<=0)
    this.store_code = this.sessionManageMent.getLocationId;
    this.webApiHttp.Get(this.webApiHttp.ApiURLArray.pos_GetStoreLocationList + 'store&email_id=' + this.sessionManageMent.getEmail).then(result => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        this.storeMasterListModels = result;
      }
    });
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
          query = ' AND [ile].' + this.filter_dynamic[i].filterKey + " like '%" + this.filter_dynamic[i].filter_value + "%'" + (i == this.filter_dynamic.length - 1 ? '' : ' AND ')
        else
          query += ' [ile].' + this.filter_dynamic[i].filterKey + " like '%" + this.filter_dynamic[i].filter_value + "%'" + (i == this.filter_dynamic.length - 1 ? '' : ' AND ')
      }
    }
    this.item_list(query);
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

  barcodefilter: string = '';

  ngOnInit(): void {
    try {
      this.barcodefilter = this.route.snapshot.paramMap.get('res');
    } catch (e) {
      this.barcodefilter = '';
    }
    if (this.barcodefilter != null && this.barcodefilter != undefined && this.barcodefilter != '') {
      this.applyFilter(this.barcodefilter, 'barcode');
    } else {
      this.item_list('');
    }


  }

  item_list(qery_parameter: string) {

    this.spinner.show();
    var json = {
      RowsPerPage: this.RowsPerPage,
      PageNumber: this.PageNumber,
      qery_parameter: qery_parameter,
      location_id: this.store_code
    }
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.ItemLedgerList, json).then(
      result => {
        if (result[0].condition == 'True') {
          this.length = result[0].total_rows;
          this.dataSource = new MatTableDataSource<ItemLedgerModel>(result);
          this.dataSource.sort = this.sort;
        } else {
          this.length = 0;
          this.dataSource = new MatTableDataSource<ItemLedgerModel>([]);
          this.dataSource.sort = this.sort;
        }
        this.spinner.hide();
        return;
        //console.log(this.dataSource);
      }
    ).catch(e => {
      this.spinner.hide();
      this._toster.error(e, 'Error');
    }).finally(() => {
      this.spinner.hide();
      if (this.barcodefilter != null && this.barcodefilter != undefined && this.barcodefilter != '') {
        (document.getElementById('barcode_inputfilter') as HTMLInputElement).value = this.barcodefilter;
      }

    })
  }

}

export class ItemLedgerModel {
  barcode: string;
  condition: string;
  created_by: string;
  created_on: string;
  document_no: string;
  document_type: string;
  entry_type: string;
  ile_no: string;
  item_no: string;
  location_id: string;
  name: string;
  quantitiy: string;
  total_rows: string;
}
