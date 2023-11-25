import {NgModule} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {Error404Module} from "./errors/404/error-404.module";
import {Error500Module} from "./errors/500/error-500.module";
import {MaintenanceModule} from "./maintenance/maintenence.module";
import {ComingSoonModule} from "./coming-soon/coming-soon.module";
import {Login2Module} from "./authentication/login-2/login-2.module";


@NgModule({
  imports: [
    // Authentication
    Login2Module,
    // Coming-soon
    ComingSoonModule,
    // Errors
    Error404Module,
    Error500Module,
    // Maintenance
    MaintenanceModule
  ],
  providers: [ToastrService]
})
export class PagesModule {

}
