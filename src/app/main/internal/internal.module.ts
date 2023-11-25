import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ItemadjusmentModule} from "./itemadjusment/itemadjusment.module";
import {MatDialogModule} from "@angular/material/dialog";
import {AdjustmentapprovallistModule} from "./itemadjusment/adjustmentapprovallist/adjustmentapprovallist.module";
import {Pos_cycle_countModule} from "./pos_cycle_count/pos_cycle_count.module";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ItemadjusmentModule,
    AdjustmentapprovallistModule,
    MatDialogModule,
    Pos_cycle_countModule,
  ]
})
export class InternalModule { }
