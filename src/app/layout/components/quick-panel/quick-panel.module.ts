import {NgModule} from '@angular/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {pristineSharedModule} from "../../../../@pristine/shared.module";
import {QuickPanelComponent} from "./quick-panel.component";

@NgModule({
  declarations: [
    QuickPanelComponent
  ],
  imports: [
    MatDividerModule,
    MatListModule,
    MatSlideToggleModule,

    pristineSharedModule,
  ],
  exports: [
    QuickPanelComponent
  ]
})
export class QuickPanelModule {
}
