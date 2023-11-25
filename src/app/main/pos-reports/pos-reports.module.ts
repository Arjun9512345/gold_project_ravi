import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SaleCategoryReportModule} from './sale-category-report/sale-category-report.module';
import {SaleSubcategoryReportModule} from './sale-subcategory-report/sale-subcategory-report.module';
import {CustomerwiseReportModule} from './customerwise-report/customerwise-report.module';
import {DetailedSaleReportModule} from './detailed-sale-report/detailed-sale-report.module';
import {SalepersonwisereportModule} from './salepersonwisereport/salepersonwisereport.module';
import {PosSalePersonPaymentHistoryReportModule} from './pos-sale-person-payment-history-report/pos-sale-person-payment-history-report.module';
import {InventoryReportModule} from "./inventory-report/inventory-report.module";
import {StockLedgerModule} from "./stock-ledger/stock-ledger.module";
import {StoreWiseInventoryModule} from "./store-wise-inventory/store-wise-inventory.module";
import {CategoryContributionReportModule} from "./category-contribution-report/category-contribution-report.module";
import {StoreInventoryReportModule} from "./store-inventory-report/store-inventory-report.module";
import {KPISModule} from "./kpis/kpis.module";
import {TransferOrderDetailModule} from "./tranferOrderDetailReport/transfer-order-detail.module";
import {AdjustmentDetailModule} from "./adjustmentDetailReport/adjustment-detail.module";
import {CycelCountDetailModule} from "./cycleCountDetailReport/cycel-count-detail.module";
import {CreditNoteReportModule} from "./credit-note-report/credit-note-report.module";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SaleCategoryReportModule,
    SaleSubcategoryReportModule,
    CustomerwiseReportModule,
    DetailedSaleReportModule,
    SalepersonwisereportModule,
    PosSalePersonPaymentHistoryReportModule,
    InventoryReportModule,
    StockLedgerModule,
    StoreWiseInventoryModule,
    CategoryContributionReportModule,
    StoreInventoryReportModule,
    KPISModule,
    TransferOrderDetailModule,
    AdjustmentDetailModule,
    CycelCountDetailModule,
    CreditNoteReportModule,
  ]
})
export class PosReportsModule { }
