import {pristineNavigationItem} from "../../../../../@pristine/types";

export class LoginModel {
  name: string;
  email: string;
  roleId: string;
  condition: string;
  message: string;
  menu: Array<pristineNavigationItem>;
  location_name: string;
  locationId: string;
  gateentry: string;
  barcode: string;
  shiftID: string;
  workType: string;
  pick: string;
  store_id: string;
  shipment: string;
  qty_change:string;
  price_change:string;
  discount_change:string;
  is_ho:string;
  cluster_id:string;
  role_name:string;
  device_type:string;
  jwt_token:string;
}
