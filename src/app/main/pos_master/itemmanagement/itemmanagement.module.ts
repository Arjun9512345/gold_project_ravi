import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ItemlistModule} from "./itemlist/itemlist.module";
import {ItemcategoryModule} from "./itemcategory/itemcategory.module";
import {ItemsubcategoryModule} from "./itemcategory/itemsubcategory/itemsubcategory.module";
import {ItemviewModule} from "./itemlist/itemview/itemview.module";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ItemlistModule,
    ItemcategoryModule,
    ItemsubcategoryModule,
    ItemviewModule
  ]
})
export class ItemmanagementModule {
}

