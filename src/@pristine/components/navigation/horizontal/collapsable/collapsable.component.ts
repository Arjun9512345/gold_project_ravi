import {Component, HostBinding, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {pristineAnimations} from "../../../../animations";
import {pristineConfigService} from "../../../../services/config.service";


@Component({
  selector: 'pristine-nav-horizontal-collapsable',
  templateUrl: './collapsable.component.html',
  styleUrls: ['./collapsable.component.scss'],
  animations: pristineAnimations
})
export class pristineNavHorizontalCollapsableComponent implements OnInit, OnDestroy {
  pristineConfig: any;
  isOpen = false;

  @HostBinding('class')
  classes = 'nav-collapsable nav-item';

  @Input()
  item: any;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _pristineConfigService: pristineConfigService
  ) {
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
    // Subscribe to config changes
    this._pristineConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (config) => {
          this.pristineConfig = config;
        }
      );
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
   * Open
   */
  @HostListener('mouseenter')
  open(): void {
    this.isOpen = true;
  }

  /**
   * Close
   */
  @HostListener('mouseleave')
  close(): void {
    this.isOpen = false;
  }
}
