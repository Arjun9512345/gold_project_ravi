import {NgModule} from '@angular/core';

import {pristineWidgetComponent} from './widget.component';
import {pristineWidgetToggleDirective} from './widget-toggle.directive';

@NgModule({
  declarations: [
    pristineWidgetComponent,
    pristineWidgetToggleDirective
  ],
  exports: [
    pristineWidgetComponent,
    pristineWidgetToggleDirective
  ],
})
export class pristineWidgetModule {
}
