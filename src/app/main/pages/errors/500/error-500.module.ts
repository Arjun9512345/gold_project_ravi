import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Error500Component} from "./error-500.component";
import {pristineSharedModule} from "../../../../../@pristine/shared.module";

const routes = [
  {
    path: 'errors/error-500',
    component: Error500Component
  }
];

@NgModule({
  declarations: [
    Error500Component
  ],
  imports: [
    RouterModule.forChild(routes),

    pristineSharedModule
  ]
})
export class Error500Module {
}
