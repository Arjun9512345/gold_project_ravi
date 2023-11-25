import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {pristineSharedModule} from "../../../../@pristine/shared.module";
import {FooterComponent} from "./footer.component";

@NgModule({
  declarations: [
    FooterComponent
  ],
  imports: [
    RouterModule,

    MatButtonModule,
    MatIconModule,
    MatToolbarModule,

    pristineSharedModule
  ],
  exports: [
    FooterComponent
  ]
})
export class FooterModule {
}
