import { Component, ViewChild } from "@angular/core";
import { ModalController, Nav, Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { HomePage } from "../pages/home/home";
import { ListPage } from "../pages/list/list";
import { MapPage } from "../map/map";
import { WelcomeModal } from "../pages/welcomeModal/welcomeModal";
import { LegendPage } from "../legend/legend";
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: "app.html"
})
export class BikeMaps2 {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = MapPage;

  pages: Array<{title: string, component: any}>;

  legend: any = LegendPage;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private translateService: TranslateService, public modalCtrl: ModalController, public storage: Storage) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: "Home", component: HomePage },
      { title: "List", component: ListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.translateService.setDefaultLang('en');
      this.translateService.use('en');
      this.presentModal();
    });
  }

  presentModal() {
    this.storage.get('hideWelcome').then((val) => {
      if (!val) {
        const modal = this.modalCtrl.create(WelcomeModal);
        modal.present();
        console.log("hideWelcome value: " + val);
      }
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
