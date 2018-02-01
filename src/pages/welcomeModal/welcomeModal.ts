import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'welcome-modal',
  templateUrl: 'welcomeModal.html'
})

export class WelcomeModal {
  hideWelcome: boolean;

  constructor(public storage: Storage, public viewCtrl: ViewController) {
  }

  dismiss() {
    this.storage.set("hideWelcome", this.hideWelcome);
    this.viewCtrl.dismiss();
  }
}
