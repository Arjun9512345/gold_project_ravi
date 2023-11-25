import {Component, ViewEncapsulation} from '@angular/core';
import {pristineAnimations} from "../../../../@pristine/animations";
import {pristineConfigService} from "../../../../@pristine/services/config.service";


@Component({
  selector: 'maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: pristineAnimations
})
export class MaintenanceComponent {
  /**
   * Constructor
   *
   * @param {pristineConfigService} _pristineConfigService
   */
  constructor(
    private _pristineConfigService: pristineConfigService
  ) {
    // Configure the layout
    this._pristineConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        toolbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        sidepanel: {
          hidden: true
        }
      }
    };
  }
}
