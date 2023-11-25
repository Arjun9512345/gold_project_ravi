export class Itemviewmodel {
  condition: string;
  item_no: string;
  purchase_unit_of_measure: string;
  sale_unit_of_measure: string;
  base_unit_of_measure: string;
  unit_price: string;
  cost_per_unit: string;
  mrp: string;
  description: string;
  main_category: string;
  main_category_name:string;
  sub_category: string;
  sub_category_name: string;
  hsn_code: string;
  tracking: string;
  good_inventory: number;
  bad_inventory: number;
  quantity_to_take: number;
  reservation_quantity: number;
  so_block_qty:number;
  to_block_qty:number;

  color: string;
  gst_group_id: string;
  gst_group_name: string;
  hsn_code_name: string;
  is_open: number;
  mid: string;
  name: string;
  size: string;
  style: string;
  transfer_cost: number;
  so_data:any;
  to_data:any;
}
export class BarcodeImageModel {
  img1: string;
  img2: string;
  img3: string;
  img4: string;
  message: string
  status: number;
   selected_image:string;
}
