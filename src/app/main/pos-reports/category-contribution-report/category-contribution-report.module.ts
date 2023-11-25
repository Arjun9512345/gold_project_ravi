import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {pristineSharedModule} from "../../../../@pristine/shared.module";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatSelectModule} from "@angular/material/select";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatMenuModule} from "@angular/material/menu";
import {AuthGuard} from "../../../../@pristine/process/AuthGuard";
import {CategoryContributionReportComponent} from "./category-contribution-report.component";

const routes: Routes = [
  {
    path: 'category_sale_contribution',
    component: CategoryContributionReportComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [CategoryContributionReportComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    pristineSharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatSidenavModule,
    MatTooltipModule,
    MatMenuModule,
  ],
  providers:[DatePipe]
})
export class CategoryContributionReportModule { }
