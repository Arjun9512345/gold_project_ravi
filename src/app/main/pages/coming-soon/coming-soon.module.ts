import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {pristineSharedModule} from "../../../../@pristine/shared.module";
import {pristineCountdownModule} from "../../../../@pristine/components";
import {ComingSoonComponent} from "./coming-soon.component";

const routes = [
  {
    path: 'coming-soon',
    component: ComingSoonComponent
  }
];

@NgModule({
  declarations: [
    ComingSoonComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,

    pristineSharedModule,
    pristineCountdownModule
  ]
})
export class ComingSoonModule {
}
