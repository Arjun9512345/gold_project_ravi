import {Pipe, PipeTransform} from "@angular/core";
import * as _ from "lodash";


@Pipe({
  name: "searchShippingOrderData"
})
export class searchShippingOrderDataFilterPipe implements PipeTransform {
  transform(items: any[], value: string): any[] {
    if (!items) {
      return [];
    }
    if (!value) {
      return items;
    }
    return _.filter(items, field => field.document_no.toLowerCase().indexOf(value.toLowerCase()) > -1)
  }
}
@Pipe({
  name: "search_by_key"
})
export class SearchByKeyValue implements PipeTransform {
  transform(items: any[],key:string, value: string): any[] {
    if (!items) {
      return [];
    }
    if (!value ||!key) {
      return items;
    }
    // console.log(key,value)
    return _.filter(items, field => field[key].toLowerCase().indexOf(value.toLowerCase()) > -1)
  }
}
@Pipe({
  name: 'searchlocation'
})
export class searchlocation {
  transform(items: any[], value: string): any[] {
    if (!items) {
      return [];
    }
    if (!value) {
      return items;
    }
    return _.filter(items, field => (field.location_name.toLowerCase().indexOf(value.toLowerCase()) > -1 ||field.location_id.toLowerCase().indexOf(value.toLowerCase()) > -1))
  }
}

@Pipe({
  name: 'searchdsp'
})
export class searchdsp {
  transform(items: any[], value: string): any[] {
    if (!items) {
      return [];
    }
    if (!value) {
      return items;
    }
    return _.filter(items, field => field.name.toLowerCase().indexOf(value.toLowerCase()) > -1)
  }
}

@Pipe({
  name: 'searchComplexObject'
})
export class searchComplexObject implements PipeTransform {
  transform(items: any[], value: string): any[] {
    if (!items || !value) {
      return items;
    }
    return items.filter(it => it.dsp_code.includes(value));
  }
}

@Pipe({
  name: 'sum'
})
export class SumPipe implements PipeTransform {
  transform(items: Array<any>, attr: string): number {
    console.log(items, attr);
    let sum_total: number = 0
    for (let i = 0; i < items.length; i++) {
      sum_total += items[i][attr]
    }

    return sum_total
  }
}

