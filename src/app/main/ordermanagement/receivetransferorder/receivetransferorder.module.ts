import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReceivetransferorderlistModule} from './receivetransferorderlist/receivetransferorderlist.module';
import {Transfer_receive_by_userModule} from "./transfer_receive_by_user/transfer_receive_by_user.module";
import {PostedreceivedtransferlistModule} from "./postedreceivedtransferlist/postedreceivedtransferlist.module";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReceivetransferorderlistModule,
    Transfer_receive_by_userModule,
    PostedreceivedtransferlistModule
  ]
})
export class ReceivetransferorderModule { }
