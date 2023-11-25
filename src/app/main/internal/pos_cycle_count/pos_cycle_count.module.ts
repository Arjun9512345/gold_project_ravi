import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { Pos_cycle_countComponent } from './add_cycle_count/pos_cycle_count.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../../../@pristine/process/AuthGuard';
import {pristineSharedModule} from '../../../../@pristine/shared.module';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatChipsModule} from "@angular/material/chips";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {Cycle_count_listComponent} from "./cycle_count_list/cycle_count_list.component";
import {Approvalcycle_count_listComponent} from "./approvar/approvalcycle_count_list/approvalcycle_count_list.component";
import {Approve_view_cycle_countComponent} from "./approvar/approve_view_cycle_count/approve_view_cycle_count.component";


const routes: Routes = [
  {
    path: 'pos_cycle_count',
    component: Pos_cycle_countComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pos_cycle_count_list',
    component: Cycle_count_listComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'approvalCycleCountList',
    component: Approvalcycle_count_listComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'approvalCyclepage',
    component: Approve_view_cycle_countComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [Pos_cycle_countComponent,Cycle_count_listComponent,Approvalcycle_count_listComponent,Approve_view_cycle_countComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    pristineSharedModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTabsModule,
    MatInputModule,
    MatRippleModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatProgressBarModule
  ],
  providers: [DatePipe],
})
export class Pos_cycle_countModule { }
