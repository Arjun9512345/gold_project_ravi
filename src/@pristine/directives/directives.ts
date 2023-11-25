import {NgModule} from '@angular/core';
import {pristineInnerScrollDirective} from "./pristine-inner-scroll/pristine-inner-scroll.directive";
import {pristinePerfectScrollbarDirective} from "./pristine-perfect-scrollbar/pristine-perfect-scrollbar.directive";
import {pristineIfOnDomDirective} from "./pristine-if-on-dom/pristine-if-on-dom.directive";
import {
  pristineMatSidenavHelperDirective,
  pristineMatSidenavTogglerDirective
} from "./pristine-mat-sidenav/pristine-mat-sidenav.directive";

@NgModule({
  declarations: [
    pristineIfOnDomDirective,
    pristineInnerScrollDirective,
    pristineMatSidenavHelperDirective,
    pristineMatSidenavTogglerDirective,
    pristinePerfectScrollbarDirective,
  ],
  imports: [],
  exports: [
    pristineIfOnDomDirective,
    pristineInnerScrollDirective,
    pristineMatSidenavHelperDirective,
    pristineMatSidenavTogglerDirective,
    pristinePerfectScrollbarDirective,
  ]
})
export class pristineDirectivesModule {
}
