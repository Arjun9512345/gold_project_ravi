import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatRippleModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {pristineNavigationComponent} from './navigation.component';
import {pristineNavVerticalItemComponent} from './vertical/item/item.component';
import {pristineNavVerticalCollapsableComponent} from './vertical/collapsable/collapsable.component';
import {pristineNavVerticalGroupComponent} from './vertical/group/group.component';
import {pristineNavHorizontalItemComponent} from './horizontal/item/item.component';
import {pristineNavHorizontalCollapsableComponent} from './horizontal/collapsable/collapsable.component';

// import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    MatIconModule,
    MatRippleModule,

    // TranslateModule.forChild()
  ],
  exports: [
    pristineNavigationComponent
  ],
  declarations: [
    pristineNavigationComponent,
    pristineNavVerticalGroupComponent,
    pristineNavVerticalItemComponent,
    pristineNavVerticalCollapsableComponent,
    pristineNavHorizontalItemComponent,
    pristineNavHorizontalCollapsableComponent
  ]
})
export class pristineNavigationModule {
}
