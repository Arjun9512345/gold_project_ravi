import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {delay, filter, take, takeUntil} from 'rxjs/operators';
import {pristineSidebarService} from "../../../../../../@pristine/components/sidebar/sidebar.service";
import {pristinePerfectScrollbarDirective} from "../../../../../../@pristine/directives/pristine-perfect-scrollbar/pristine-perfect-scrollbar.directive";
import {pristineConfigService} from "../../../../../../@pristine/services/config.service";
import {pristineNavigationService} from "../../../../../../@pristine/components/navigation/navigation.service";


@Component({
  selector: 'navbar-vertical-style-1',
  templateUrl: './style-1.component.html',
  styleUrls: ['./style-1.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarVerticalStyle1Component implements OnInit, OnDestroy {
  pristineConfig: any;
  navigation: any;

  // Private
  private _pristinePerfectScrollbar: pristinePerfectScrollbarDirective;
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {pristineConfigService} _pristineConfigService
   * @param {PristineNavigationService} _PristineNavigationService
   * @param {PristineSidebarService} _PristineSidebarService
   * @param {Router} _router
   */
  constructor(
    private _pristineConfigService: pristineConfigService,
    private _PristineNavigationService: pristineNavigationService,
    private _PristineSidebarService: pristineSidebarService,
    private _router: Router
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  // Directive
  @ViewChild(pristinePerfectScrollbarDirective, {static: true})
  set directive(theDirective: pristinePerfectScrollbarDirective) {
    if (!theDirective) {
      return;
    }

    this._pristinePerfectScrollbar = theDirective;

    // Update the scrollbar on collapsable item toggle
    this._PristineNavigationService.onItemCollapseToggled
      .pipe(
        delay(500),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        this._pristinePerfectScrollbar.update();
      });

    // Scroll to the active item position
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1)
      )
      .subscribe(() => {
          setTimeout(() => {
            this._pristinePerfectScrollbar.scrollToElement('navbar .nav-link.active', -120);
          });
        }
      );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
          if (this._PristineSidebarService.getSidebar('navbar')) {
            this._PristineSidebarService.getSidebar('navbar').close();
          }
        }
      );

    // Subscribe to the config changes
    this._pristineConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.pristineConfig = config;
      });

    // Get current navigation
    this._PristineNavigationService.onNavigationChanged
      .pipe(
        filter(value => value !== null),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        this.navigation = this._PristineNavigationService.getCurrentNavigation();
      });
    this.sidebar_isfolded_or_not=this._PristineSidebarService.getSidebar('navbar').folded;
  }

  sidebar_isfolded_or_not:boolean=false;

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
   * Toggle sidebar opened status
   */
  toggleSidebarOpened(): void {
    this._PristineSidebarService.getSidebar('navbar').toggleOpen();
  }

  /**
   * Toggle sidebar folded status
   */
  toggleSidebarFolded(): void {
    this._PristineSidebarService.getSidebar('navbar').toggleFold();
    this.sidebar_isfolded_or_not=this._PristineSidebarService.getSidebar('navbar').folded;
  }
}
