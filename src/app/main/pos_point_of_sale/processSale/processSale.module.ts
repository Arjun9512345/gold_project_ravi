import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { ProcessSaleComponent } from './processSale.component';
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
import { CreatePayment_pageComponent } from './create-payment_page/create-payment_page.component';
import {MatRippleModule} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatChipsModule} from "@angular/material/chips";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {HttpClient} from "@angular/common/http";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatListModule} from "@angular/material/list";
import {MatMenuModule} from "@angular/material/menu";
import {Item_qty_price_changeComponent} from "./item_qty_price_change/item_qty_price_change.component";
import {Customer_history_itemsComponent} from "./customer_history_items/customer_history_items.component";



const routes: Routes = [
  {
    path: 'enter-new-sale',
    component: ProcessSaleComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [ProcessSaleComponent, CreatePayment_pageComponent,Item_qty_price_changeComponent,Customer_history_itemsComponent],
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
    MatButtonToggleModule,
    MatAutocompleteModule,
    MatListModule,
    MatMenuModule,
  ],
  providers: [DatePipe,HttpClient],
})
export class ProcessSaleModule { }
