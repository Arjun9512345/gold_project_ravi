import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {pristineConfigService} from "../@pristine/services/config.service";
import {pristineSplashScreenService} from "../@pristine/services/splash-screen.service";
import {WebApiHttp} from "../@pristine/process/WebApiHttp.services";
import {Router} from "@angular/router";
import {pristineNavigationService} from "../@pristine/components/navigation/navigation.service";
import {SessionManageMent} from "../@pristine/process/SessionManageMent";
import {pristineSidebarService} from "../@pristine/components/sidebar/sidebar.service";
import {DOCUMENT} from "@angular/common";
import {SignalR} from "../@pristine/process/SignalR";
import {takeUntil} from "rxjs/operators";
import {Platform} from "@angular/cdk/platform";
import {Subject} from "rxjs";
import {navigation} from "./navigation/navigation";
import {loadingmessage, loadingstyle} from "./modal/loadingtext";
import {receiverData, ReceiveResponseMessageModel} from "./modal/SignalRModel";

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  pristineConfig: any;
  navigation: any;
  funny_loading_text: any = loadingmessage;
  loading_style: any = loadingstyle;
  textindex: number = 0;
  styleindex: number = 0;
  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private _pristineConfigService: pristineConfigService,
    private _pristineNavigationService: pristineNavigationService,
    private _pristineSidebarService: pristineSidebarService,
    private _pristineSplashScreenService: pristineSplashScreenService,
    private _platform: Platform,
    private _sessionManageMent: SessionManageMent,
    private _router: Router,
    private _signalR: SignalR,
    private _webapiHttp: WebApiHttp,
  ) {
    // Get default navigation
    this.navigation = navigation;


    // Register the navigation to the service
    //this._pristineNavigationService.register('main', this.navigation);

    // Set the main navigation as our current navigation
    //this._pristineNavigationService.setCurrentNavigation('main');

    // Add is-mobile class to the body if the platform is mobile
    if (this._platform.ANDROID || this._platform.IOS) {
      this.document.body.classList.add('is-mobile');
    }

    // Set the private defaults
    this._unsubscribeAll = new Subject();

   // go to login page when use is unauthorized..
   //  if (this._sessionManageMent.getEmail == '') {
    this._router.navigateByUrl('/pages/auth/login-2');
   //  }
   //  else {
   //    this._signalR.startConnection(this._sessionManageMent.getEmail, this._webapiHttp.globalurl + this._webapiHttp.ApiURLArray.signalRNotification);
   //    navigation[0].children = this._sessionManageMent.getMenu[0].children;
   //    this._pristineNavigationService.register('main', this._sessionManageMent.getMenu);
   //    this._pristineNavigationService.setCurrentNavigation('main');
   //
   //    receiverData.subscribe(result => {
   //      this.ResponseHitFromServer(result);
   //    });
   //  }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to config changes

    setInterval(() => {
      this.showRandomly();
    }, 5000);

    this._pristineConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {

        this.pristineConfig = config;

        // Boxed
        if (this.pristineConfig.layout.width === 'boxed') {
          this.document.body.classList.add('boxed');
        } else {
          this.document.body.classList.remove('boxed');
        }

        // Color theme - Use normal for loop for IE11 compatibility
        for (let i = 0; i < this.document.body.classList.length; i++) {
          const className = this.document.body.classList[i];

          if (className.startsWith('theme-')) {
            this.document.body.classList.remove(className);
          }
        }

        this.document.body.classList.add(this.pristineConfig.colorTheme);
      });

  }

  showRandomly() {
    this.textindex = Math.floor(Math.random() * (this.funny_loading_text.length - 1));
    this.styleindex = Math.floor(Math.random() * (this.loading_style.length - 1));
  }


  ResponseHitFromServer(data: ReceiveResponseMessageModel) {
    try {
      if (data.action == 'Logout') {
        this._signalR.stopSignalRConnection();
        localStorage.clear();
        //this._router.navigateByUrl('/pages/auth/login-2');
        window.location.reload();

      }
    } catch (e) {

    }
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle sidebar open
   *
   * @param key
   */
  toggleSidebarOpen(key): void {
    this._pristineSidebarService.getSidebar(key).toggleOpen();
  }
}

