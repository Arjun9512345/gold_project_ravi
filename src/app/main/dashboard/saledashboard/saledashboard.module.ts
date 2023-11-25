import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { SaledashboardComponent } from './saledashboard.component';
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

const routes: Routes = [
  {
    path: 'saledashboard',
    component: SaledashboardComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [SaledashboardComponent],
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
    MatSelectModule
  ],
  providers:[DatePipe]
})
export class SaledashboardModule { }
