import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {pristineConfigService} from "../../services/config.service";

@Component({
  selector: 'pristine-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class pristineSearchBarComponent implements OnInit, OnDestroy {
  collapsed: boolean;
  pristineConfig: any;

  @Output()
  input: EventEmitter<any>;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {pristineConfigService} _pristineConfigService
   */
  constructor(
    private _pristineConfigService: pristineConfigService
  ) {
    // Set the defaults
    this.input = new EventEmitter();
    this.collapsed = true;

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
   * Collapse
   */
  collapse(): void {
    this.collapsed = true;
  }

  /**
   * Expand
   */
  expand(): void {
    this.collapsed = false;
  }

  /**
   * Search
   *
   * @param event
   */
  search(event): void {
    this.input.emit(event.target.value);
  }

}
