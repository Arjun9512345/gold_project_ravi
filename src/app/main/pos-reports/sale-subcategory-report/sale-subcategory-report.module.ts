import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../../../@pristine/process/AuthGuard';
import {pristineSharedModule} from '../../../../@pristine/shared.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatExpansionModule} from '@angular/material/expansion';
import {SaleSubcategoryReportComponent} from './sale-subcategory-report.component';
import {MatSelectModule} from '@angular/material/select';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatMenuModule} from "@angular/material/menu";

const routes: Routes = [
  {
    path: 'sale_sub_category',
    component: SaleSubcategoryReportComponent,
    canActivate: [AuthGuard]
  }
];


@NgModule({
  declarations: [SaleSubcategoryReportComponent],
    imports: [
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
        MatTooltipModule,
        MatSidenavModule,
        MatMenuModule
    ],
  providers:[DatePipe]
})
export class SaleSubcategoryReportModule { }
