import {NgModule} from '@angular/core';

import {KeysPipe} from './keys.pipe';
import {GetByIdPipe} from './getById.pipe';
import {HtmlToPlaintextPipe} from './htmlToPlaintext.pipe';
import {FilterPipe} from './filter.pipe';
import {CamelCaseToDashPipe} from './camelCaseToDash.pipe';
import {FirstAnd_Split} from "./FirstAnd_Split";
import {Time24to12Pipe} from "./time24to12";
import {
  searchComplexObject,
  searchdsp,
  searchlocation,
  searchShippingOrderDataFilterPipe,
  SearchByKeyValue,
  SumPipe
} from "./data-filter.pipe";
import {SafePipe} from "./SafePipe";

@NgModule({
  declarations: [
    KeysPipe,
    GetByIdPipe,
    HtmlToPlaintextPipe,
    FilterPipe,
    Time24to12Pipe,
    searchShippingOrderDataFilterPipe,
    searchlocation,
    FirstAnd_Split,
    CamelCaseToDashPipe,
    SumPipe,
    SearchByKeyValue,
    searchComplexObject,
    searchdsp,
    SafePipe
  ],
  imports: [],
  exports: [
    searchdsp,
    KeysPipe,
    GetByIdPipe,
    HtmlToPlaintextPipe,
    FilterPipe,
    Time24to12Pipe,
    searchlocation,
    FirstAnd_Split,
    searchShippingOrderDataFilterPipe,
    CamelCaseToDashPipe,
    SumPipe,
    SearchByKeyValue,
    searchComplexObject,
    SafePipe
  ]
})
export class pristinePipesModule {
}
