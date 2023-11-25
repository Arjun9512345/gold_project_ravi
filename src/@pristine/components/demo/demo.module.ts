import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';

import {pristineDemoContentComponent} from './demo-content/demo-content.component';
import {pristineDemoSidebarComponent} from './demo-sidebar/demo-sidebar.component';

@NgModule({
  declarations: [
    pristineDemoContentComponent,
    pristineDemoSidebarComponent
  ],
  imports: [
    RouterModule,

    MatDividerModule,
    MatListModule
  ],
  exports: [
    pristineDemoContentComponent,
    pristineDemoSidebarComponent
  ]
})
export class pristineDemoModule {
}
