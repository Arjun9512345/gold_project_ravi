import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {pristineSharedModule} from "../../../@pristine/shared.module";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {Pos_storeModule} from "./pos_store/pos_store.module";
import {Pos_terminal_mstModule} from "./pos_terminal_mst/pos_terminal_mst.module";
import {PosSalePersonModule} from './pos-sale-person/pos-sale-person.module';
import {Item_ledger_entry_listModule} from "./item_ledger_entry_list/item_ledger_entry_list.module";
import {Cluster_mstModule} from "./cluster_mst/cluster_mst.module";
import {ItemmanagementModule} from "./itemmanagement/itemmanagement.module";
import {BarcodelistModule} from "./barcodelist/barcodelist.module";
import {Pos_customerModule} from "./pos_customer/pos_customer.module";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    pristineSharedModule,
    MatIconModule,
    MatProgressBarModule,
    Pos_storeModule,
    Pos_terminal_mstModule,
    PosSalePersonModule,
    Item_ledger_entry_listModule,
    Cluster_mstModule,
    ItemmanagementModule,
    BarcodelistModule,
    Pos_customerModule
  ]
})
export class POSMasterModule {
}
