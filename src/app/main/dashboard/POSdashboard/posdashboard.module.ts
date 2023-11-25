import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PosdashboardComponent} from './posdashboard.component'
import {AuthGuard} from "../../../../@pristine/process/AuthGuard";
import {RouterModule, Routes} from "@angular/router";
import {ExtendedModule} from "@angular/flex-layout";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatMenuModule} from "@angular/material/menu";
import {MatSelectModule} from "@angular/material/select";
import {MatTabsModule} from "@angular/material/tabs";
import {pristineSharedModule} from "../../../../@pristine/shared.module";
import {pristineWidgetModule} from "../../../../@pristine/components";
import {MatCardModule} from "@angular/material/card";

const routes: Routes = [
  {
    path: 'posDashBoard',
    component: PosdashboardComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [PosdashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    pristineSharedModule,
    MatIconModule,
    MatProgressBarModule
  ]
})
export class PosdashboardModule {
}
