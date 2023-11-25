import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {pristineSharedModule} from "../../../@pristine/shared.module";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {ProcessSaleModule} from "./processSale/processSale.module";
import {Sale_historyModule} from "./sale_history/sale_history.module";
import {ProcessSaleReturnModule} from "./processSaleReturn/processSaleReturn.module";
import {Credit_noteModule} from "./credit_note/credit_note.module";
import {Sale_history_all_storeModule} from "./sale_history_all_store/sale_history_all_store.module";
import {Sale_day_closeModule} from "./sale_day_close/sale_day_close.module";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    pristineSharedModule,
    MatIconModule,
    MatProgressBarModule,
    ProcessSaleModule,
    Sale_historyModule,
    ProcessSaleReturnModule,
    Credit_noteModule,
    Sale_history_all_storeModule,
    Sale_day_closeModule
  ]
})
export class Point_of_saleModule {
}
