import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NavbarModule} from "../../components/navbar/navbar.module";
import {ToolbarModule} from "../../components/toolbar/toolbar.module";
import {VerticalLayout1Component} from "./layout-1.component";
import {FooterModule} from "../../components/footer/footer.module";
import {ContentModule} from "../../components/content/content.module";
import {pristineSharedModule} from "../../../../@pristine/shared.module";
import {QuickPanelModule} from "../../components/quick-panel/quick-panel.module";
import {pristineSidebarModule} from "../../../../@pristine/components";

@NgModule({
  declarations: [
    VerticalLayout1Component
  ],
  imports: [
    RouterModule,

    pristineSharedModule,
    pristineSidebarModule,

    ContentModule,
    FooterModule,
    NavbarModule,
    QuickPanelModule,
    ToolbarModule
  ],
  exports: [
    VerticalLayout1Component
  ]
})
export class VerticalLayout1Module {
}
