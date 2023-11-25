import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {UserDetailComponent} from "./UserDetail.component";
import {pristineSharedModule} from "../../../../../@pristine/shared.module";
import {pristineWidgetModule} from "../../../../../@pristine/components";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatChipsModule} from "@angular/material/chips";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatInputModule} from "@angular/material/input";
import { pristinePipesModule } from 'src/@pristine/pipes/pipes.module';

const routes: Routes = [
  {
    path: 'userdetail',
    component: UserDetailComponent,
  }
];

@NgModule({
  declarations: [
    UserDetailComponent
  ],
    imports: [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatTabsModule,
        pristineSharedModule,
        pristineWidgetModule,
        MatCardModule,
        MatDividerModule,
        MatTableModule,
        MatPaginatorModule,
        MatChipsModule,
        MatTooltipModule,
        MatInputModule,

    ]
})
export class UserDetailModule {
}

