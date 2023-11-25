import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {TransferModule} from "./transfer/transfer.module";
import {ReceivetransferorderModule} from './receivetransferorder/receivetransferorder.module';
import {MatDialogModule} from "@angular/material/dialog";
import {pristineSharedModule} from "../../../@pristine/shared.module";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TransferModule,
    pristineSharedModule,
    MatDialogModule,
    ReceivetransferorderModule
  ],
  providers:[DatePipe]
})
export class OrdermanagementModule {
}
