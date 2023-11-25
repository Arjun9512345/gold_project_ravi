import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {WebApiHttp} from "../../../../../@pristine/process/WebApiHttp.services";
import {Itemcategorymodel} from "./itemcategorymodel";
import {NgxSpinnerService} from "ngx-spinner";

@Injectable({
  providedIn: 'root'
})
export class ItemcategoryService implements Resolve<any> {
  ItemCategoryList: Array<Itemcategorymodel> = [];

  constructor(private webApiHttp: WebApiHttp, private spinner: NgxSpinnerService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

    return new Promise(((resolve, reject) => {
      Promise.all([this.CatagoryList()]).then(([itemcatlist]) => {
        this.ItemCategoryList = itemcatlist;
        resolve();
      }, reject).catch(err => {
        reject(err);
      })

    }))
  }

  CatagoryList(): Promise<any> {
    return new Promise<any>(((resolve, reject) => {
      this.webApiHttp.Get(this.webApiHttp.ApiURLArray.ItemCategoryList)
        .then(result => resolve(result), reject).catch(error => reject(error));
    }))
  }

}
