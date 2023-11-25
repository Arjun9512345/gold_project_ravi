import {NgModule} from '@angular/core';
import {NavbarVerticalStyle2Module} from "./vertical/style-2/style-2.module";
import {pristineSharedModule} from "../../../../@pristine/shared.module";
import {NavbarComponent} from "./navbar.component";
import {NavbarVerticalStyle1Module} from "./vertical/style-1/style-1.module";

@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    pristineSharedModule,

    NavbarVerticalStyle1Module,
    NavbarVerticalStyle2Module
  ],
  exports: [
    NavbarComponent
  ]
})
export class NavbarModule {
}
