import {ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit} from '@angular/core';
import {merge, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {pristineNavigationItem} from "../../../../types";
import {pristineNavigationService} from "../../navigation.service";


@Component({
  selector: 'pristine-nav-vertical-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class pristineNavVerticalItemComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  classes = 'nav-item';

  @Input()
  item: pristineNavigationItem;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   */

  /**
   *
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @param {pristineNavigationService} _pristineNavigationService
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _pristineNavigationService: pristineNavigationService
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
    // Subscribe to navigation item
    merge(
      this._pristineNavigationService.onNavigationItemAdded,
      this._pristineNavigationService.onNavigationItemUpdated,
      this._pristineNavigationService.onNavigationItemRemoved
    ).pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {

        // Mark for check
        this._changeDetectorRef.markForCheck();
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
