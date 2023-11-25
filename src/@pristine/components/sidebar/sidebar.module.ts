import {NgModule} from '@angular/core';

import {pristineSidebarComponent} from './sidebar.component';

@NgModule({
  declarations: [
    pristineSidebarComponent
  ],
  exports: [
    pristineSidebarComponent
  ]
})
export class pristineSidebarModule {
}
