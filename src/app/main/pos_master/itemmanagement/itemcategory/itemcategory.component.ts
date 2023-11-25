import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ItemcategoryService} from "./itemcategory.service";
import {Itemcategorymodel} from "./itemcategorymodel";
import {Router} from "@angular/router";
import {EncriptDecript} from "../../../../../@pristine/process/EncriptDecript";
import {MatDialog} from "@angular/material/dialog";
import {itemcategorycreationComponent} from "./itemcategorycreation/itemcategorycreation.component";
import {pristineConfirmDialogComponent} from "../../../../../@pristine/components/confirm-dialog/confirm-dialog.component";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {ToastrService} from "ngx-toastr";
import {SessionManageMent} from "../../../../../@pristine/process/SessionManageMent";

@Component({
  selector: 'app-createvendor',
  templateUrl: './itemcategory.component.html',
  styleUrls: ['./itemcategory.component.scss']
})
export class ItemcategoryComponent implements OnInit {
  loadding:boolean=false;
  ItemCategoryList: Array<Itemcategorymodel> = [];
  displayedColumns: string[] = ['attribute_type','code', 'name', 'Sub_Category'];
  dataSource: MatTableDataSource<Itemcategorymodel>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private _itemcategoryservice: ItemcategoryService,
              private router: Router,
              private WebApiHttp: WebApiHttp,
              public sessionManageMent: SessionManageMent,
              private _toasterService: ToastrService,
              private _encryptdecrypt: EncriptDecript,
              private dialogActions: MatDialog
  ) {

    this.ItemCategoryList = this._itemcategoryservice.ItemCategoryList
    this.dataSource = new MatTableDataSource<Itemcategorymodel>(this.ItemCategoryList)

  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

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
    var dialogConfig = this.dialogActions.open(itemcategorycreationComponent, {
      data: {flag: 'insert'}
    })
    dialogConfig.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.loadding=true;
        this._itemcategoryservice.CatagoryList().then(result => {
          this.ItemCategoryList = result as Itemcategorymodel[];
          this.dataSource = new MatTableDataSource<Itemcategorymodel>(this.ItemCategoryList)
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }).finally(()=>{
          this.loadding=false;
        })
      }
    })
  }

  OnClickEdit(categorydata: any) {
    var dialogConfig = this.dialogActions.open(itemcategorycreationComponent, {
      data: {flag: 'update', category: categorydata}
    })
    dialogConfig.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.loadding=true;
        this._itemcategoryservice.CatagoryList().then(result => {
          this.ItemCategoryList = result as Itemcategorymodel[];
          this.dataSource = new MatTableDataSource<Itemcategorymodel>(this.ItemCategoryList)
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }).finally(()=>{
          this.loadding=false;
        })
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
            Id: data.id,
          }
          this.WebApiHttp.Post(this.WebApiHttp.ApiURLArray.ItemCategoryDelete, json).then(result => {
            if (result[0].condition.toLowerCase() == 'true') {
              this._toasterService.success('success', result[0].message);
              this._itemcategoryservice.CatagoryList().then(result => {
                this.ItemCategoryList = result as Itemcategorymodel[];
                this.dataSource = new MatTableDataSource<Itemcategorymodel>(this.ItemCategoryList)
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              })
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

  ShowItemSubCategory(data) {
    this.router.navigate(['/pos_master/itemcategory/itemsubcategory', {res: this._encryptdecrypt.encrypt(JSON.stringify(data))}])
  }
}
