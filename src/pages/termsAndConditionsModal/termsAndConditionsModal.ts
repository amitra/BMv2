import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'terms-and-conditions-modal',
  templateUrl: 'termsAndConditionsModal.html'
})

export class TermsAndConditionsModal {
  hideWelcome: boolean;

  constructor(private viewCtrl: ViewController) {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}