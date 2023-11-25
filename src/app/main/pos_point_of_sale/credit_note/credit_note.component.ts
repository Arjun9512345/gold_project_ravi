import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {WebApiHttp} from '../../../../@pristine/process/WebApiHttp.services';
import {SessionManageMent} from '../../../../@pristine/process/SessionManageMent';
import {animate, state, style, transition, trigger} from "@angular/animations";


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;
}

@Component({
  selector: 'app-product_brand',
  templateUrl: './credit_note.component.html',
  styleUrls: ['./credit_note.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class Credit_noteComponent implements OnInit {
 expandedElement: CreditNoteListModel;


 async selected_Row(element: CreditNoteListModel) {
   let position = -1;
   for (let i = 0; i < this.viewBrandDataSource.data.length; i++) {
     if (element.return_no == this.viewBrandDataSource.data[i].return_no
       && element.sale_header_no == this.viewBrandDataSource.data[i].sale_header_no
       && element.credit_no == this.viewBrandDataSource.data[i].credit_no) {
       position = i;
       break;
     }
   }
   if (position != -1) {
     await this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_credit_note_detail + element.credit_no).then((result: Array<Credit_noteListModel>) => {
       if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
         this.viewBrandDataSource.data[position].creditnotDetail = result;
       }
     })
     this.viewBrandDataSource.data[position].Action = !this.viewBrandDataSource.data[position].Action;
   }
 }

  displayedColumns: string[] = ['sale_header_no', 'return_no',
    'credit_no', 'credit_payment', 'credit_applied','Action'];
  viewBrandDataSource: MatTableDataSource<CreditNoteListModel> = new MatTableDataSource<CreditNoteListModel>();
  @ViewChild('first_paginator', {static: true}) first_paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  loadding: boolean = false;

  constructor(public sessionManageMent: SessionManageMent,
              public webApiHttp: WebApiHttp,
              private _formBuilder: FormBuilder,
              private _toster: ToastrService) {
  }

  ngOnInit(): void {
    this.getCreditNoteViewList();
  }

  applyFilter(filterValue: string, keyName: string) {
    this.viewBrandDataSource.filter = filterValue;
    this.viewBrandDataSource.filterPredicate = function (data, filter: string): boolean {
      if (data[keyName] != undefined && data[keyName] != null && data[keyName] != '') {
        return (data[keyName] != null && data[keyName] != undefined ? data[keyName].toString().toLowerCase() : '').includes(filter.toLowerCase());
      } else {
        return false;
      }
    };
  }

  getCreditNoteViewList() {
    this.loadding = true;
  this.webApiHttp.Get(this.webApiHttp.ApiURLArray.get_credit_note_header).then((result) => {
      var response: Array<CreditNoteListModel> = result;
        this.viewBrandDataSource = new MatTableDataSource<CreditNoteListModel>(response);
        this.viewBrandDataSource.paginator = this.first_paginator;
        this.viewBrandDataSource.sort = this.sort;
    }).catch(error => {
      this._toster.error(error, 'Error');
    }).finally(() => {
      this.loadding = false;
    });
  }

}

export class CreditNoteListModel {
  credit_applied:  string;
  credit_no: string;
  credit_payment:  string;
  last_credit_applied_on:  string;
  return_no:  string;
  sale_header_no:  string;
  Action:boolean;
  creditnotDetail:Array<Credit_noteListModel>;
}
export class Credit_noteListModel {
  applied_customer_Name: string;
  condition: string;
  credit_amt: string;
  credit_applied: string;
  credit_note_no: string;
  credit_payment: string;
  remaning_credit_amt: string;
  return_customer_Name: string;
  sale_header_no: string;
}


