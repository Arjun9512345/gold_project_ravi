import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { Sale_history_all_storeComponent } from './sale_history_all_store.component';
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
import {CreateSaleHistoryPopupComponent} from "./create-sale_history_popup/create-sale_history_popup.component";
import {MatMenuModule} from "@angular/material/menu";


const routes: Routes = [
  {
    path: 'sale_history_all',
    component: Sale_history_all_storeComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [Sale_history_all_storeComponent,CreateSaleHistoryPopupComponent],
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
        MatProgressBarModule,
        MatMenuModule
    ],
  providers: [DatePipe],
})
export class Sale_history_all_storeModule { }
