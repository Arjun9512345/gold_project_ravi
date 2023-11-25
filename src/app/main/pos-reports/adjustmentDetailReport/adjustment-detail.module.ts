import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {AdjustmentDetailComponent} from "./adjustment-detail.component";
import {AuthGuard} from "../../../../@pristine/process/AuthGuard";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatDividerModule} from "@angular/material/divider";
import {MatTableModule} from "@angular/material/table";
import {pristineSharedModule} from "../../../../@pristine/shared.module";
import {MatSortModule} from "@angular/material/sort";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatMenuModule} from "@angular/material/menu";
import {MatTabsModule} from "@angular/material/tabs";

const route: Routes = [
  {
    path: 'adjustment_report',
    component: AdjustmentDetailComponent,
    canActivate: [AuthGuard]
  }
]

@NgModule({
  declarations: [AdjustmentDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    MatPaginatorModule,
    MatDividerModule,
    MatTableModule,
    pristineSharedModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSidenavModule,
    MatProgressBarModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatTabsModule,
  ]
})
export class AdjustmentDetailModule { }
