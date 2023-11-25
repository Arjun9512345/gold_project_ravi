import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaindashboardModule} from './maindashboard/maindashboard.module';
import {PosdashboardModule} from "./POSdashboard/posdashboard.module";
import {SaledashboardModule} from './saledashboard/saledashboard.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaindashboardModule,
    PosdashboardModule,
    SaledashboardModule
  ]
})
export class DashboardModule {
}
