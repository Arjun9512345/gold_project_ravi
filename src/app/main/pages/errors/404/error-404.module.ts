import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {Error404Component} from "./error-404.component";
import {pristineSharedModule} from "../../../../../@pristine/shared.module";

const routes = [
  {
    path: 'errors/error-404',
    component: Error404Component
  }
];

@NgModule({
  declarations: [
    Error404Component
  ],
  imports: [
    RouterModule.forChild(routes),

    MatIconModule,

    pristineSharedModule
  ]
})
export class Error404Module {
}
