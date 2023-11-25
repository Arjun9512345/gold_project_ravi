import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StoreMasterListModel} from "../../pos_master/pos_store/pos_store.component";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {ToastrService} from "ngx-toastr";
import {EncriptDecript} from "../../../../@pristine/process/EncriptDecript";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {DatePipe} from "@angular/common";
import {ExcelService} from "../../../../@pristine/process/excel.Service";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-category-contribution-report',
  templateUrl: './category-contribution-report.component.html',
  styleUrls: ['./category-contribution-report.component.scss']
})
export class CategoryContributionReportComponent implements OnInit {

  today = new Date();
  salecategoryForm: FormGroup;
  total_amount:any=0;
  showTable:boolean=false;
  showExcel=false;
  formated_data:Array<any>=[];
  storeMasterListModels: Array<StoreMasterListModel> = [];
  displayedColumns: string[] = [];
  hideFilter : boolean = true;
  footerLine: Array<any> =[];
  dataSource: MatTableDataSource<any>=new MatTableDataSource<any>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild('content', {static: false}) divcontent: ElementRef;

  constructor(public sessionManageMent: SessionManageMent,
              private webApiHttp: WebApiHttp,
              private _formBuilder: FormBuilder,
              private _toster: ToastrService,
              private _encriptDecript: EncriptDecript,
              private router: Router,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService,
              private datePipe:DatePipe,
              private  excelService:  ExcelService,) {
    // this.webApiHttp.Get(this.webApiHttp.ApiURLArray.pos_GetStoreLocationList + 'store').then(result => {
    //   if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
    //     this.storeMasterListModels = result;
    //   }
    // });
    this.salecategoryForm = _formBuilder.group({
      // store_id: ['', Validators.required],
      from_date: [this.today, Validators.required],
      to_date: [this.today, Validators.required],
    });
  }
  applyFilter(filterValue: string, keyName: string) {
    this.dataSource.filter = filterValue;
    this.dataSource.filterPredicate = function(data, filter: string): boolean {
      if (data[keyName] != undefined && data[keyName] != null && data[keyName] != '') {
        return (data[keyName] != null && data[keyName] != undefined ? data[keyName].toString().toLowerCase() : '').includes(filter.toLowerCase());
      } else {
        return false;
      }
    };
  }

  // length = 0;
  // RowsPerPage = 10;
  // pageSizeOptions: number[] = [5, 10, 25, 100];
  // PageNumber = 0;
  // //
  // // myPagginaterEvent(event) {
  // //   this.RowsPerPage = event.pageSize;
  // //   this.PageNumber = event.pageIndex;
  // //   this.applyFilter('', '');
  // // }

  ngOnInit(): void {
  }
  getReport(){
    this.showExcel = false;
    this.total_amount=0;
    this.dataSource.data=[];
    const json={
      // store_id: this.salecategoryForm.get('store_id').value,
      startDate: this.datePipe.transform(this.salecategoryForm.get('from_date').value,'yyyy-MM-dd'),
      endDate: this.datePipe.transform(this.salecategoryForm.get('to_date').value,'yyyy-MM-dd'),
    }
    this.spinner.show();

    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.get_sale_category_contribution_report,json).then(result => {
      if(result[0]?.condition?.toLowerCase() == 'true') {
        this.formatResponse(result)
      }else{
          this.spinner.hide();
          this._toster.info('No record Found','Info');
      }
      // if(result[0].condition.toLowerCase()=='true'){
      //   this.dataSource = new MatTableDataSource<any>(result);
      //   this.dataSource.sort = this.sort;
      //   this.showExcel = true
      //   this.spinner.hide();
      // }
      // else{
      //   this.spinner.hide();
      //   this._toster.info(result[0]?.message,'Info');
      // }

    }, error => {
      this.spinner.hide();
    });
  }

  downloadExcel() {
    console.log(this.footerLine)
    let download : Array<any> =[]
    for (let i = 0; i < this.formated_data.length; i++) {
      delete this.formated_data[i].condition
    }
    download = this.formated_data.map(e=>e);
    download.push(this.footerLine);
    console.log(download)
    this.excelService.exportAsExcelFile((this.formated_data), 'CategoryContribution')
  }


  private formatResponse(val: any) {
    this.formated_data = [];
    this.displayedColumns =[];
    this.displayedColumns.push('store_name');
    for(let i1 = 0; i1 < val?.length; i1++ ){
      for(let i2 =0; i2<val[i1]?.icm?.length; i2++){
        if(this.displayedColumns.indexOf(val[i1]?.icm[i2]?.cat_name) < 0){
          this.displayedColumns.push(val[i1]?.icm[i2]?.cat_name);
        }
      }
    }
    let dummyArray: Array<any> =[];
    let total: number = 0;
    let lineData: Array<any>=[];
    let per_displacy: any =[];

    for(let i =0; i<val?.length;i++){
      dummyArray['store_name'] = val[i]?.name;
      for(let j =0 ; j< this.displayedColumns.length;j++){
      for(let k =0; k<val[i]?.icm?.length; k++){
          if( this.displayedColumns[j]?.toLowerCase() != 'store_name' ) {
            if (this.displayedColumns[j]?.toLowerCase() == val[i]?.icm[k]?.cat_name.toLowerCase()) {
              dummyArray[this.displayedColumns[j]] =  val[i]?.icm[k]?.total_sale
              total += (Number(val[i]?.icm[k]?.total_sale));
              lineData[this.displayedColumns[j]] =  val[i]?.icm[k]?.total_sale
              break;
            }
              else {
              dummyArray[this.displayedColumns[j]] =  0
              lineData[this.displayedColumns[j]] =  0
            }
          }
        }
      }
      dummyArray['Grand_Total'] = total;

      for(let i =0; i < this.displayedColumns.length; i++){
        if(this.displayedColumns[i] != 'store_name' && this.displayedColumns[i] != 'Grand_Total'){
          if(per_displacy.indexOf(this.displayedColumns[i]+'(%)')<0) {
            per_displacy.push(this.displayedColumns[i] + '(%)')
          }
          dummyArray[this.displayedColumns[i]+'(%)'] = (Number((lineData[this.displayedColumns[i]]/total)*100)).toFixed(2)
        }
      }
      this.formated_data[this.formated_data?.length] =dummyArray;
      dummyArray = []
      total =0
    }
    this.displayedColumns.push('Grand_Total');
    for(let i =0; i< per_displacy.length; i++){
      this.displayedColumns[this.displayedColumns.length] =per_displacy[i]
    }
    this.dataSource = new MatTableDataSource<any>(this.formated_data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.showExcel = true
      this.spinner.hide();
  }

  getTotal(column: string) {
    if(column == 'store_name'){
      this.footerLine[column] = 'Grand Total';
      return 'Grand Total'
    }else{
      let calc = Number(this.formated_data.map(v => Number(v[column])).reduce((a, b) => Number(a) + Number(b), 0))
      if(column.includes('%')) {
        this.footerLine[column] = (calc/this.formated_data?.length).toFixed(2);
        return (calc/this.formated_data?.length).toFixed(2)
      }else{
        this.footerLine[column] = calc;
        return calc
      }
    }
  }
}
