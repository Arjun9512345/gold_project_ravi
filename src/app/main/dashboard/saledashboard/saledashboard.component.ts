import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SessionManageMent} from '../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../@pristine/process/WebApiHttp.services';
import {ToastrService} from 'ngx-toastr';
import {EncriptDecript} from '../../../../@pristine/process/EncriptDecript';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {Pos7DaysDataModel} from '../../../modal/DashboardDataModel';
import {DatePipe} from '@angular/common';
import {StoreMasterListModel} from '../../pos_master/pos_store/pos_store.component';

@Component({
  selector: 'app-saledashboard',
  templateUrl: './saledashboard.component.html',
  styleUrls: ['./saledashboard.component.scss']
})
export class SaledashboardComponent implements OnInit {

  today = new Date();
  saledashboardForm: FormGroup;
  sale_dashboard_detail:Array<any>=[];
  total_amount:any=0;
  showTable:boolean=false;
  storeMasterListModels: Array<StoreMasterListModel> = [];
  @ViewChild('content', {static: false}) divcontent: ElementRef;

  constructor(public sessionManageMent: SessionManageMent,
              private webApiHttp: WebApiHttp,
              private _formBuilder: FormBuilder,
              private _toster: ToastrService,
              private _encriptDecript: EncriptDecript,
              private router: Router,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService,
              private datePipe:DatePipe) {
    this.webApiHttp.Get(this.webApiHttp.ApiURLArray.pos_GetStoreLocationList + 'store&email_id='+this.sessionManageMent.getEmail).then(result => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        this.storeMasterListModels = result;
      }
    });
    this.saledashboardForm = _formBuilder.group({
      store_id: ['', Validators.required],
      from_date: ['', Validators.required],
      to_date: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  getSaleDashboard(){
    this.total_amount=0;
    const json={
      store_id: this.saledashboardForm.get('store_id').value,
      from_date: this.datePipe.transform(this.saledashboardForm.get('from_date').value,'yyyy-MM-dd'),
      to_date: this.datePipe.transform(this.saledashboardForm.get('to_date').value,'yyyy-MM-dd'),
    }
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.dash_sale_amount_data_from_to,json).then(result => {
      this.showTable=true;
      this.sale_dashboard_detail = result;
      this.total_amount=this.sale_dashboard_detail[0]?.diff_card_amt+
        this.sale_dashboard_detail[0]?.diff_cash_amt+
        this.sale_dashboard_detail[0]?.diff_credit_amt+
        this.sale_dashboard_detail[0]?.diff_paytm_amt+
      this.sale_dashboard_detail[0]?.diff_upi_amt+
        this.sale_dashboard_detail[0]?.diff_jio_cashback;

      this.total_amount=parseFloat(this.total_amount.toFixed(2));
    }, error => {
      console.log(error);
    });
  }



  pdfGenrate() {
    let content = this.divcontent.nativeElement;
    let printContents, popupWin;
    printContents = content.innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=600px,width=600px');
    popupWin.document.open();
    popupWin.document.write(
      `<style>
       table{
         border-collapse: collapse;
         overflow-x:auto;
          margin-top: 0;
          width:100%!important;
          border:1px solid black;
          /*page-break-inside:auto;*/
          font-size: 12px;

        }

        .tbl-content{
          border-top: none;
          border-bottom: none;
        }
        .tbl-content-header{
            width: auto;
            border:none;
            padding:5px;
            text-align:start
        }
        th{
          padding: 15px 10px;
          border: 1px solid black;
        }
        td{
          padding: 15px;
          border : 1px solid black;

        }
        .amount-align{
            text-align: center;
        }
        .top{
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            border: none;
        }
        </style><body onload="window.print();">${printContents}</body>`
    );
    popupWin.document.close();
  }

}
