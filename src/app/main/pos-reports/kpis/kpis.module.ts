 import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KPISComponent } from '../kpis/kpis.component';
 import {RouterModule, Routes} from "@angular/router";
 import {AuthGuard} from "../../../../@pristine/process/AuthGuard";
 import {MatIconModule} from "@angular/material/icon";
 import {MatMenuModule} from "@angular/material/menu";
 import {MatFormFieldModule} from "@angular/material/form-field";
 import {pristineSharedModule} from "../../../../@pristine/shared.module";
 import {MatTooltipModule} from "@angular/material/tooltip";
 import {MatButtonModule} from "@angular/material/button";
 import {MatSelectModule} from "@angular/material/select";
 import {MatInputModule} from "@angular/material/input";
 import {MatDatepickerModule} from "@angular/material/datepicker";
 import {MatDividerModule} from "@angular/material/divider";
 import {MatTableModule} from "@angular/material/table";
 import {MatSortModule} from "@angular/material/sort";
 import {MatPaginatorModule} from "@angular/material/paginator";
 import {MatSidenavModule} from "@angular/material/sidenav";
 import {MatProgressBarModule} from "@angular/material/progress-bar";
 import {MatAutocompleteModule} from "@angular/material/autocomplete";

 const route: Routes =[
   {
     path: 'KPIS-report',
     component: KPISComponent,
     canActivate: [AuthGuard]
   }
 ]

@NgModule({
  declarations: [KPISComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    pristineSharedModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatDividerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatMenuModule,
  ]
})
export class KPISModule { }
