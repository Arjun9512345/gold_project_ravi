import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BarcodelistComponent} from './barcodelist.component';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../../../@pristine/process/AuthGuard";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {pristineSharedModule} from "../../../../@pristine/shared.module";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatChipsModule} from "@angular/material/chips";
import {MatBadgeModule} from "@angular/material/badge";

const routes: Routes = [{
  path: 'barcodelist',
  component: BarcodelistComponent,
  canActivate: [AuthGuard]
}]

@NgModule({
  declarations: [BarcodelistComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatDividerModule,
    MatIconModule,
    pristineSharedModule,
    MatDialogModule,
    MatButtonModule,
    MatChipsModule,
    MatBadgeModule
  ]
})
export class BarcodelistModule {
}
