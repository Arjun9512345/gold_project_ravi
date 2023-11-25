import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { Sale_day_closeComponent } from './sale_day_close.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../../../@pristine/process/AuthGuard';
import {pristineSharedModule} from '../../../../@pristine/shared.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatMenuModule} from "@angular/material/menu";

const routes: Routes = [
  {
    path: 'sale_day_close',
    component: Sale_day_closeComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [Sale_day_closeComponent],
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
        MatSelectModule,
        MatTooltipModule,
        MatMenuModule
    ],
  providers:[DatePipe]
})
export class Sale_day_closeModule { }
