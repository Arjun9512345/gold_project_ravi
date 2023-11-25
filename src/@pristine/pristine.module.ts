import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';

import {EncriptDecript} from "./process/EncriptDecript";
import {SignalR} from "./process/SignalR";
import {AuthGuard} from "./process/AuthGuard";
import {ExcelService} from "./process/excel.Service";
import {WebApiHttp} from "./process/WebApiHttp.services";
import {ValidateResponse} from "./process/ValidateResponse";
import {SessionManageMent} from "./process/SessionManageMent";
import {pristine_CONFIG} from "./services/config.service";

@NgModule()
export class pristineModule {
  constructor(@Optional() @SkipSelf() parentModule: pristineModule) {
    if (parentModule) {
      throw new Error('pristineModule is already loaded. Import it in the AppModule only!');
    }
  }

  static forRoot(config): ModuleWithProviders<any> {
    return {
      ngModule: pristineModule,
      providers: [EncriptDecript, ValidateResponse, WebApiHttp, ExcelService, AuthGuard, SignalR, SessionManageMent,
        {
          provide: pristine_CONFIG,
          useValue: config
        }
      ]
    };
  }
}
