import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdjustmentlistModule} from "./adjustmentlist/adjustmentlist.module";
import {AdjusmentcreateModule} from "./adjusmentcreate/adjusmentcreate.module";
import {AdjustmentapprovallistModule} from "./adjustmentapprovallist/adjustmentapprovallist.module";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdjustmentlistModule,
    AdjusmentcreateModule,
    AdjustmentapprovallistModule
  ]
})
export class ItemadjusmentModule {
}
