import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

import {pristineSearchBarComponent} from './search-bar.component';

@NgModule({
  declarations: [
    pristineSearchBarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,

    MatButtonModule,
    MatIconModule
  ],
  exports: [
    pristineSearchBarComponent
  ]
})
export class pristineSearchBarModule {
}
