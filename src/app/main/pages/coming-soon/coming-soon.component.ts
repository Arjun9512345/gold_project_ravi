import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {pristineAnimations} from "../../../../@pristine/animations";
import {pristineConfigService} from "../../../../@pristine/services/config.service";

@Component({
  selector: 'coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: pristineAnimations
})
export class ComingSoonComponent implements OnInit {
  comingSoonForm: FormGroup;

  /**
   * Constructor
   *
   * @param {pristineConfigService} _pristineConfigService
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    private _pristineConfigService: pristineConfigService,
    private _formBuilder: FormBuilder
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

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.comingSoonForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
}
