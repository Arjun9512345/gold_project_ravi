import {NgModule} from '@angular/core';
import {RoleMasterModule} from "./RoleMaster/RoleMaster.module";
import {UserSetupModule} from "./UserSetup/UserSetup.module";
import {pristineSharedModule} from "../../../@pristine/shared.module";
import {Pos_sync_mstModule} from "./pos_sync_mst/pos_sync_mst.module";

@NgModule({
  imports: [
    RoleMasterModule,
    UserSetupModule,
    pristineSharedModule,
    Pos_sync_mstModule
  ]
})
export class SetupModule {
}
