import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {RouterModule, Routes} from "@angular/router";
import {pristineSharedModule} from "../@pristine/shared.module";
import {MatIconModule} from "@angular/material/icon";
import {pristineProgressBarModule, pristineSidebarModule, pristineThemeOptionsModule} from "../@pristine/components";
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import {NgxSpinnerModule} from "ngx-spinner";
import {ToastrModule} from "ngx-toastr";
import { HttpClientModule} from "@angular/common/http";
import {MatButtonModule} from "@angular/material/button";
import {pristineModule} from "../@pristine/pristine.module";
import {pristineConfig} from "./pristine-config";
import {LayoutModule} from "./layout/layout.module";

const appRoutes: Routes = [
  {
    path: 'pages',
    loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./main/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'ordermanagement',
    loadChildren: () => import('./main/ordermanagement/ordermanagement.module').then(m => m.OrdermanagementModule)
  },
  {
    path: 'setup',
    loadChildren: () => import('./main/Setup/Setup.module').then(value => value.SetupModule)
  },
  {
    path:'pointofsale',
    loadChildren:()=>import ('./main/pos_point_of_sale/point_of_sale.module').then(m=>m.Point_of_saleModule)
  },
  {
    path:'pos_master',
    loadChildren:()=>import ('./main/pos_master/POSMaster.module').then(m=>m.POSMasterModule)
  },
  {
    path: 'reports',
    loadChildren: () => import('./main/pos-reports/pos-reports.module').then(m => m.PosReportsModule)
  },
  {
    path: 'internal',
    loadChildren: () => import('./main/internal/internal.module').then(m => m.InternalModule)
  }
  ,
  {
    path: 'mydashboard',
    redirectTo: ''
  },
  {
    path: '**',
    redirectTo: '/pages/auth/login-2'
  }
];


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      countDuplicates: true,
      resetTimeoutOnDuplicate: true,
      progressBar: true,
      progressAnimation: 'decreasing',
      closeButton: true,

    }), // ToastrModule added
    NgxSpinnerModule,
    RouterModule.forRoot(appRoutes, {useHash: true}),
    // Material moment date module
    MatMomentDateModule,

    // Material
    MatButtonModule,
    MatIconModule,

    // pristine modules
    pristineModule.forRoot(pristineConfig),
    pristineProgressBarModule,
    pristineSharedModule,
    pristineSidebarModule,
    pristineThemeOptionsModule,


    // App modules
    LayoutModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production})
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
