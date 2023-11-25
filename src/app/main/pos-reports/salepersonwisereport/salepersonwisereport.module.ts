import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { SalepersonwisereportComponent } from './salepersonwisereport.component';
import {RouterModule, Routes} from '@angular/router';
import {pristineSharedModule} from '../../../../@pristine/shared.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSelectModule} from '@angular/material/select';
import {AuthGuard} from '../../../../@pristine/process/AuthGuard';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatSortModule} from "@angular/material/sort";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatMenuModule} from "@angular/material/menu";

const routes: Routes = [
  {
    path: 'salepersonwise_report',
    component: SalepersonwisereportComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [SalepersonwisereportComponent],
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
        MatProgressBarModule,
        MatSidenavModule,
        MatSortModule,
        MatTooltipModule,
        MatMenuModule
    ],
  providers: [DatePipe],
})
export class SalepersonwisereportModule { }
