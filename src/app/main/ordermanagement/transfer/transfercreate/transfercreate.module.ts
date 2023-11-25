import {MatFormFieldModule} from "@angular/material/form-field";
import {RouterModule, Routes} from "@angular/router";
import {pristineSharedModule} from "../../../../../@pristine/shared.module";
import {MatSelectModule} from "@angular/material/select";
import {TransfercreateComponent} from "./transfercreate.component";
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatPaginatorModule} from "@angular/material/paginator";
import {NgModule} from "@angular/core";
import {MatInputModule} from "@angular/material/input";
import {AuthGuard} from "../../../../../@pristine/process/AuthGuard";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatMenuModule} from "@angular/material/menu";
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
const routes: Routes = [
  {
    path: 'transfercreate',
    component: TransfercreateComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [TransfercreateComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    pristineSharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatDividerModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTooltipModule,
    MatMenuModule,
    NgxQRCodeModule,
    MatDatepickerModule,
    MatAutocompleteModule
  ]
})
export class TransfercreateModule {
}
