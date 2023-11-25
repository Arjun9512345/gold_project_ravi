import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {WebApiHttp} from "../../../../../../@pristine/process/WebApiHttp.services";
import {EncriptDecript} from "../../../../../../@pristine/process/EncriptDecript";
import {ToastrService} from "ngx-toastr";
import {Itemcategorymodel, Itemsubcategorymodel,} from "../itemcategorymodel";
import {NgxSpinnerService} from "ngx-spinner";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {itemsubcategorycreationComponent} from "./itemsubcategorycreation/itemsubcategorycreation.component";
import {itemcategorycreationComponent} from "../itemcategorycreation/itemcategorycreation.component";
import {pristineConfirmDialogComponent} from "../../../../../../@pristine/components/confirm-dialog/confirm-dialog.component";


@Component({
  selector: 'change-password-dialog',
  templateUrl: './itemsubcategory.component.html',
  styleUrls: ['./itemsubcategory.component.scss']
})
export class itemsubcategoryComponent implements OnInit {
  loadding:boolean=false;
  id: number;
  ItemSubcategoryList: Array<Itemsubcategorymodel> = []
  displayedColumns: string[] = ['attribute_type','code', 'name'];
  dataSource: MatTableDataSource<Itemcategorymodel>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public webApiHttp: WebApiHttp,
    public _encryptdecrypt: EncriptDecript,
    private  router: Router,
    private dialogActions: MatDialog,
    private  route: ActivatedRoute,
    private fb: FormBuilder,
    private _toasterService: ToastrService
  ) {

  }


  ngOnInit(): void {
    this.id = JSON.parse(this._encryptdecrypt.decrypt(this.route.snapshot.paramMap.get('res')));
    try {
      this.spinner.show();
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.ItemSubCategoryList + this.id)
        .then(result => {
          if (Array.isArray(result) && result.length) {
            this.ItemSubcategoryList = result as Itemsubcategorymodel[];
            this.dataSource = new MatTableDataSource<Itemsubcategorymodel>(this.ItemSubcategoryList)
            this.dataSource.paginator = this.paginator,
              this.dataSource.sort = this.sort;
            this.spinner.hide();
          } else {
            this._toasterService.error('error', 'Data not found');
            this.spinner.hide();
            this.dataSource = new MatTableDataSource<Itemsubcategorymodel>([])
            this.dataSource.paginator = this.paginator,
              this.dataSource.sort = this.sort;
          }
        }, error => {
          this._toasterService.error('error', error)
          this.spinner.hide();
        })
    } catch (e) {
      this._toasterService.error('error', e)
      this.spinner.hide();
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

  OnClickNew() {
    var dialogConfig = this.dialogActions.open(itemsubcategorycreationComponent, {
      data: {flag: 'insert', id: this.id}
    })
    dialogConfig.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.ngOnInit();
      }
    })
  }

  OnClickEdit(categorydata: any) {
    var dialogConfig = this.dialogActions.open(itemcategorycreationComponent, {
      data: {flag: 'update', category: categorydata}
    })
    dialogConfig.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.ngOnInit()
      }
    })
  }

  OnClickDelete(data: any) {
    var dialogConfig = this.dialogActions.open(pristineConfirmDialogComponent)
    dialogConfig.componentInstance.confirmMessage = 'Are You Sure ! You want to delete item' + ' ' + '(' + data.code + ')' + ' ' + 'category'
    dialogConfig.afterClosed().subscribe(result => {
      if (result == true) {
        try {
          const json = {
            Id: data.code,
          }
          this.webApiHttp.Post(this.webApiHttp.ApiURLArray.ItemCategoryDelete, json).then(result => {
            if (result[0].condition.toLowerCase() == 'true') {
              this._toasterService.success('success', result[0].message);
              this.ngOnInit()
            } else {
              this._toasterService.error('error', result[0].message);
            }
          }, error => {
            this._toasterService.error('error', error)
          })
        } catch (e) {
          this._toasterService.error('error', e)
        }
      }
    })
  }

}
