import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SessionManageMent} from '../../../../@pristine/process/SessionManageMent';
import {WebApiHttp} from '../../../../@pristine/process/WebApiHttp.services';
import {ToastrService} from 'ngx-toastr';
import {EncriptDecript} from '../../../../@pristine/process/EncriptDecript';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {DatePipe} from '@angular/common';
import {StoreMasterListModel} from '../../pos_master/pos_store/pos_store.component';
import {ExcelService} from "../../../../@pristine/process/excel.Service";

@Component({
  selector: 'app-sale_day_close',
  templateUrl: './sale_day_close.component.html',
  styleUrls: ['./sale_day_close.component.scss']
})
export class Sale_day_closeComponent implements OnInit {

  saledashboardForm: FormGroup;
  today: any = new Date();
  storeMasterListModels: Array<StoreMasterListModel> = [];
  storeFilterArray:Array<StoreMasterListModel>=[];
  @ViewChild('content', {static: false}) divcontent: ElementRef;


  constructor(public sessionManageMent: SessionManageMent,
              private webApiHttp: WebApiHttp,
              private _formBuilder: FormBuilder,
              private _toster: ToastrService,
              private _datePipe: DatePipe,
              private _encriptDecript: EncriptDecript,
              private router: Router,
              private route: ActivatedRoute,
              private excelService:ExcelService,
              private spinner: NgxSpinnerService,) {
    this.adjustmentFormGroup = this._formBuilder.group({
      start_date:[this.today, Validators.required],
      end_date:[this.today, Validators.required],
      store:['', Validators.required]
    });

    this.saledashboardForm = _formBuilder.group({
      store_id: ['', Validators.required],
      from_date: ['', Validators.required],
      to_date: ['', Validators.required],
      terminal_id: ['']
    });
  }

  date_range_data: Array<{
    condition: string;
    end_date: string;
    start_date: string;
  }> = [];

  getDateRange() {
    this.spinner.show();
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.StatementPostingGetDateRange, {
      store_id: this.saledashboardForm.get('store_id').value,
      terminal_id: this.saledashboardForm.get('terminal_id').value
    }).then(result => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        this.date_range_data = result;
        this.saledashboardForm.get('from_date').setValue( this._datePipe.transform(this.date_range_data[0].start_date, 'MM/dd/yyyy'));
      }
    }).finally(() => {
      this.spinner.hide();
    });
  }

  pos_teminal_list: Array<{
    condition: string,
    store_code: string,
    computer_description: string,
    pos_code: string
  }> = [];

  BindPosTerminal(store_id: string) {
    this.spinner.show();
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.pos_InsertUpdateSelectDeletePOSTerminalMaster, {
      flag: "SELECT_TERMINAL",
      store_code: store_id,
      pos_code: "",
      computer_description: ""
    }).then(result => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        this.pos_teminal_list = result;
      }
    }).finally(() => {
      this.spinner.hide();
      this.getDateRange();
    });
  }

  ngOnInit(): void {
    this.spinner.show();
    this.webApiHttp.Get(this.webApiHttp.ApiURLArray.pos_GetStoreLocationList + 'store&email_id=' + this.sessionManageMent.getEmail).then(result => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        this.storeMasterListModels = result;
        this.storeFilterArray=result;
      }
    }).finally(() => {
      this.spinner.hide();
      this.CreateDayCloseHeader();
    });
  }

  day_close_data_response: Array<DayCloseDocument> = [];

  CreateDayCloseHeader() {
    let json = {
      store_id: this.saledashboardForm.get('store_id').value,
      terminal_id: this.saledashboardForm.get('terminal_id').value,
      tran_start_date: this._datePipe.transform(this.saledashboardForm.get('from_date').value, 'yyyy-MM-dd'),
      tran_end_date: this._datePipe.transform(this.saledashboardForm.get('to_date').value, 'yyyy-MM-dd'),
      created_by: this.sessionManageMent.getEmail
    }
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.StatementCreateHeader, json).then(result => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        this.day_close_data_response = result;
        this.day_close_data_response[0].spl.map(item => {
          item.difference_amount = item.trans_amount - item.counted_amount;
        })
      } else {
        this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
      }

    }).catch(err => {
      this._toster.error(err.message, 'Error');
    });
  }

  getTotalAmount() {
    let sum: number = 0;
    for (let i = 0; i < this.day_close_data_response[0].spl.length; i++) {
      sum += this.day_close_data_response[0].spl[i].trans_amount;
    }

    return sum.toFixed(2);
  }

  getCountedAmount() {
    let sum: number = 0;
    for (let i = 0; i < this.day_close_data_response[0].spl.length; i++) {
      sum += this.day_close_data_response[0].spl[i].counted_amount;
    }

    return sum.toFixed(2);
  }

  getFloatAmountAmount() {
    let sum: number = 0;
    for (let i = 0; i < this.day_close_data_response[0].spl.length; i++) {
      sum += this.day_close_data_response[0].spl[i].float_amount;
    }

    return sum.toFixed(2);
  }

  getDiffrenceAmount() {
    let sum: number = 0;
    for (let i = 0; i < this.day_close_data_response[0].spl.length; i++) {
      sum += this.day_close_data_response[0].spl[i].difference_amount;
    }

    return sum.toFixed(2);
  }

  changeAmountValue(item: DayCloseLineModel) {
   if ((item.counted_amount + item.float_amount) > item.trans_amount) {
      item.counted_amount = 0;
      this._toster.warning('Counted Amount Plush Float Amount  Equal To Total Amount', 'Warning');
    }
    item.difference_amount = item.trans_amount - item.counted_amount;

  }

  discardDocument() {
    let json = {
      document_no: this.day_close_data_response[0].document_no,
      created_by: this.sessionManageMent.getEmail
    }
    this.spinner.show();
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.StatementPostingDiscardDocument, json).then(result => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        this.day_close_data_response = [];
        this.date_range_data = [];
        this.saledashboardForm.get('store_id').setValue('');
        this.saledashboardForm.get('from_date').setValue('');
        this.saledashboardForm.get('to_date').setValue('');
        this.saledashboardForm.get('terminal_id').setValue('');
      } else {
        this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
      }

    }).catch(err => {
      this._toster.error(err.message, 'Error');
    }).finally(() => {
      this.spinner.hide();
    });
  }

  SubmitDocumentDocument() {
    let json: Array<{}> = [];
    this.day_close_data_response[0].spl.map(item => {
      json.push({
        document_no: item.document_no,
        line_no: item.line_no,
        tender_type: item.tender_type,
        counted_amount: item.counted_amount,
        transaction_amount: item.trans_amount,
        float_amount: item.float_amount,
        difference_amount: item.difference_amount,
        created_by: this.sessionManageMent.getEmail
      });
    });

    this.spinner.show();
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.StatementUpdateLineAmount, json).then(result => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {
        this.day_close_data_response = [];
        this.date_range_data = [];
        this.saledashboardForm.get('store_id').setValue('');
        this.saledashboardForm.get('from_date').setValue('');
        this.saledashboardForm.get('to_date').setValue('');
        this.saledashboardForm.get('terminal_id').setValue('');
        this._toster.success('Successfully Posted.', 'Success');
      } else {
        this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
      }

    }).catch(err => {
      this._toster.error(err.message, 'Error');
    }).finally(() => {
      this.spinner.hide();
    });
  }

  filterOptions(val: any) {
    if(val==null || val==undefined ||val ==''){
      this.storeFilterArray = this.storeMasterListModels;
    }else{
      this.storeFilterArray = this.storeMasterListModels.filter((unit) =>( unit?.name?.toLowerCase().indexOf(val) > -1 || unit?.id?.toLowerCase().indexOf(val) > -1));
    }
  }
  adjustmentFormGroup: FormGroup;
  DownloadReport() {

    let json = {
      store_id:this.adjustmentFormGroup.get('store').value,
      tran_start_date:this._datePipe.transform(this.adjustmentFormGroup.get('start_date').value, 'yyyy-MM-dd'),
      tran_end_date:this._datePipe.transform(this.adjustmentFormGroup.get('end_date').value, 'yyyy-MM-dd')
    };
    this.spinner.show();
    this.webApiHttp.Post(this.webApiHttp.ApiURLArray.StatementPostingReport, json).then(result => {
      if (result.length > 0 && result[0].condition.toLowerCase() == 'true') {

        this.excelService.MultisheetWorkbook([result[0].statement_posting_header,
          result[0].statement_posting_lines,
          result[0].statement_posting_sale_relation],['statement_posting_header','statement_posting_lines','statement_posting_sale_relation'],'day_close_data')
        this._toster.success('Successfully Get Report.', 'Success');
      } else {
        this._toster.error(result.length > 0 ? result[0].message : result.message, 'Error');
      }

    }).catch(err => {
      this._toster.error(err.message, 'Error');
    }).finally(() => {
      this.spinner.hide();
    });
  }

}

export class DayCloseDocument {
  condition: string;
  document_no: string;
  store_id: string;
  terminal_id: string;
  tran_start_date: string;
  tran_end_date: string;
  created_on: string;
  created_by: string;
  total_no_of_order: number;
  status: string;
  completed_on: string;
  completed_by: string;
  total_sales_amount:number;
  total_sale_retur_amount:number;
  total_day_close_amount:number;
  total_cgst_amount:number;
  total_sgst_amount:number;
  total_igst_amount:number;
  spl: Array<DayCloseLineModel>
}

export class DayCloseLineModel {
  document_no: string;
  line_no: string;
  tender_type: string;
  counted_amount: number;
  trans_amount: number;
  difference_amount: number;
  float_amount: number;
  updated_by: string;
}
