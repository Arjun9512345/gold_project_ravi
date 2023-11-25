import {Directive, HostBinding, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {MediaObserver} from '@angular/flex-layout';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {pristineMatSidenavHelperService} from "./pristine-mat-sidenav.service";
import {pristineMatchMediaService} from "../../services/match-media.service";


@Directive({
  selector: '[pristineMatSidenavHelper]'
})
export class pristineMatSidenavHelperDirective implements OnInit, OnDestroy {
  @HostBinding('class.mat-is-locked-open')
  isLockedOpen: boolean;

  @Input()
  pristineMatSidenavHelper: string;

  @Input()
  matIsLockedOpen: string;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {pristineMatchMediaService} _pristineMatchMediaService
   * @param {pristineMatSidenavHelperService} _pristineMatSidenavHelperService
   * @param {MatSidenav} _matSidenav
   * @param {MediaObserver} _mediaObserver
   */
  constructor(
    private _pristineMatchMediaService: pristineMatchMediaService,
    private _pristineMatSidenavHelperService: pristineMatSidenavHelperService,
    private _matSidenav: MatSidenav,
    private _mediaObserver: MediaObserver
  ) {
    // Set the defaults
    this.isLockedOpen = true;

    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Register the sidenav to the service
    this._pristineMatSidenavHelperService.setSidenav(this.pristineMatSidenavHelper, this._matSidenav);

    if (this.matIsLockedOpen && this._mediaObserver.isActive(this.matIsLockedOpen)) {
      this.isLockedOpen = true;
      this._matSidenav.mode = 'side';
      this._matSidenav.toggle(true);
    } else {
      this.isLockedOpen = false;
      this._matSidenav.mode = 'over';
      this._matSidenav.toggle(false);
    }

    this._pristineMatchMediaService.onMediaChange
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        if (this.matIsLockedOpen && this._mediaObserver.isActive(this.matIsLockedOpen)) {
          this.isLockedOpen = true;
          this._matSidenav.mode = 'side';
          this._matSidenav.toggle(true);
        } else {
          this.isLockedOpen = false;
          this._matSidenav.mode = 'over';
          this._matSidenav.toggle(false);
        }
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}

@Directive({
  selector: '[pristineMatSidenavToggler]'
})
export class pristineMatSidenavTogglerDirective {
  @Input()
  pristineMatSidenavToggler: string;

  /**
   * Constructor
   *
   * @param {pristineMatSidenavHelperService} _pristineMatSidenavHelperService
   */
  constructor(
    private _pristineMatSidenavHelperService: pristineMatSidenavHelperService) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * On click
   */
  @HostListener('click')
  onClick(): void {
    this._pristineMatSidenavHelperService.getSidenav(this.pristineMatSidenavToggler).toggle();
  }
}
