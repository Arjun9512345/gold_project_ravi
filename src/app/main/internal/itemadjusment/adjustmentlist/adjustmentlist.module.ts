import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdjustmentlistComponent} from './adjustmentlist.component';
import {RouterModule, Routes} from "@angular/router";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatSelectModule} from "@angular/material/select";
import {AuthGuard} from "../../../../../@pristine/process/AuthGuard";
import {pristineSharedModule} from "../../../../../@pristine/shared.module";
import {MatTooltipModule} from "@angular/material/tooltip";

const route: Routes = [{
  path: 'itemadjusment',
  component: AdjustmentlistComponent,
  canActivate: [AuthGuard]
}]

@NgModule({
  declarations: [AdjustmentlistComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    MatPaginatorModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    pristineSharedModule,
    MatSelectModule,
    MatTooltipModule,

  ]
})
export class AdjustmentlistModule {
}
