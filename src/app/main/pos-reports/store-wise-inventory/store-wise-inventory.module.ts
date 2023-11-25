import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StoreWiseInventoryComponent} from "./store-wise-inventory.component";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../../../@pristine/process/AuthGuard";
import {MatSelectModule} from "@angular/material/select";
import {MatSidenavModule} from "@angular/material/sidenav";
import {pristineSharedModule} from "../../../../@pristine/shared.module";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { MatMenuModule } from '@angular/material/menu';
import {MatExpansionModule} from "@angular/material/expansion";

const route: Routes = [
  {
    path: 'store-wise-inventory',
    component: StoreWiseInventoryComponent,
    canActivate : [AuthGuard]
  }
]

@NgModule({
  declarations: [StoreWiseInventoryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    MatSelectModule,
    MatSidenavModule,
    pristineSharedModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatMenuModule,
    MatDividerModule,
    MatButtonModule,
    MatProgressBarModule,
    MatInputModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatExpansionModule,
  ]
})
export class StoreWiseInventoryModule { }
