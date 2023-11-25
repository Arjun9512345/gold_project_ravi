import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {pristineSharedModule} from "../../../../@pristine/shared.module";
import {ContentComponent} from "./content.component";


@NgModule({
  declarations: [
    ContentComponent
  ],
  imports: [
    RouterModule,
    pristineSharedModule
  ],
  exports: [
    ContentComponent
  ]
})
export class ContentModule {
}
