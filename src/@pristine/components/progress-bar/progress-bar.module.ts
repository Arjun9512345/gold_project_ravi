import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import {pristineProgressBarComponent} from './progress-bar.component';

@NgModule({
  declarations: [
    pristineProgressBarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,

    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  exports: [
    pristineProgressBarComponent
  ]
})
export class pristineProgressBarModule {
}
