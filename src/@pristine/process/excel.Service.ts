import {Injectable} from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {

  constructor() {
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    // console.log('worksheet',worksheet);
    // const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    // this.saveAsExcelFile(excelBuffer, excelFileName);
    this.downloadFileInCsv(json, excelFileName);
  }

  downloadFileInCsv(data: any[], filename: string) {
    const replacer = (key, value) => value === null ? '' : value;
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');
    var blob = new Blob([csvArray], {type: 'text/csv;charset=UTF-8'});
    FileSaver.saveAs(blob, filename + new Date().getTime() + ".csv");
  }

  public exportAsExcelBin_BlockBin(block_in_Bin: any[], pending_to_scan: any[], single_Pending_to_Scan: any[], excelFileName: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(block_in_Bin);
    const worksheet1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(pending_to_scan);
    const worksheet2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(single_Pending_to_Scan);
    //console.log('worksheet', worksheet);
    const workbook: XLSX.WorkBook = {
      Sheets: {
        'block_in_Bin': worksheet,
        'pending_to_scan': worksheet1,
        'single_Pending_to_Scan': worksheet2
      }, SheetNames: ['block_in_Bin', 'pending_to_scan', 'single_Pending_to_Scan']
    };
    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public exportAsSaleHeaderSaleLine(sale_header: any[], sale_Line: any[], excelFileName: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(sale_header);
    const worksheet1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(sale_Line);
    //console.log('worksheet', worksheet);
    const workbook: XLSX.WorkBook = {
      Sheets: {
        'sale_header': worksheet,
        'sale_Line': worksheet1,
      }, SheetNames: ['sale_header', 'sale_Line']
    };
    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public exportAsSaleHeaderManifest(menifestdata: any[], postedmenifestdata: any[], excelFileName: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(menifestdata);
    const worksheet1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(postedmenifestdata);
    //console.log('worksheet', worksheet);
    const workbook: XLSX.WorkBook = {
      Sheets: {
        'manifestdata': worksheet,
        'posted_menifest': worksheet1,
      }, SheetNames: ['posted_menifest', 'manifestdata']
    };
    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public exportAsSlotInfoReport(Barcode_needed_toConsolidate: any[], Single_pending_for_OQC: any[], excelFileName: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Barcode_needed_toConsolidate);
    const worksheet1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Single_pending_for_OQC);
    //console.log('worksheet', worksheet);
    const workbook: XLSX.WorkBook = {
      Sheets: {
        'Barcode_needed_to_Consolidate': worksheet,
        'Single_pending_for_OQC': worksheet1,
      }, SheetNames: ['Barcode_needed_to_Consolidate', 'Single_pending_for_OQC']
    };
    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
//multiExcel
  public MultisheetWorkbook(sheet_data: any[], sheet_name: any[], excelFileName: string): void {
    let sheets : any = []
    for(let i=0; i<sheet_name.length; i++){
      sheets[sheet_name[i]] = XLSX.utils.json_to_sheet(sheet_data[i])
    }
    const workbook: XLSX.WorkBook = {
      Sheets: {...sheets},
      SheetNames: sheet_name
    };
    console.log(workbook)
    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

}
