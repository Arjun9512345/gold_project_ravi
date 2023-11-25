import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {pristineSharedModule} from "../../../../@pristine/shared.module";
import {MaintenanceComponent} from "./maintenance.component";


const routes = [
  {
    path: 'maintenance',
    component: MaintenanceComponent
  }
];

@NgModule({
  declarations: [
    MaintenanceComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    pristineSharedModule
  ]
})
export class MaintenanceModule {
}
