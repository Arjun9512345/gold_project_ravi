export class roleDetailModel {
  condition: string;
  role_id: number;
  role_name: string;

}



export class Rolemodel {
  menu_name: string;
  parent_page_id: string;
  check: boolean;
  children: Array<{
    children_name: string
    page_id: number
    check: number;
  }>;
}



