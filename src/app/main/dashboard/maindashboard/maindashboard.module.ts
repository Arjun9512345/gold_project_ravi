import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaindashboardComponent} from './maindashboard.component'
import {AuthGuard} from "../../../../@pristine/process/AuthGuard";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {
    path: 'maindashboard',
    component: MaindashboardComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [MaindashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MaindashboardModule {
}
