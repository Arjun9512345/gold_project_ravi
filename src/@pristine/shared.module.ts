import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {pristineDirectivesModule} from "./directives/directives";
import {pristinePipesModule} from "./pipes/pipes.module";
import {MatDividerModule} from "@angular/material/divider";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    pristineDirectivesModule,
    pristinePipesModule,
    MatDividerModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    pristineDirectivesModule,
    pristinePipesModule
  ],
})
export class pristineSharedModule {
}
