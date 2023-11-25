import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {NavbarVerticalStyle2Component} from "./style-2.component";
import {pristineSharedModule} from "../../../../../../@pristine/shared.module";
import {pristineNavigationModule} from "../../../../../../@pristine/components";

@NgModule({
  declarations: [
    NavbarVerticalStyle2Component
  ],
  imports: [
    MatButtonModule,
    MatIconModule,

    pristineSharedModule,
    pristineNavigationModule
  ],
  exports: [
    NavbarVerticalStyle2Component
  ]
})
export class NavbarVerticalStyle2Module {
}
