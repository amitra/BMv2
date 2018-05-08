import { Component, ViewChild } from "@angular/core";
import { ModalController, Nav, Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { ListPage } from "../pages/list/list";
import { MapPage } from "../map/map";
import { WelcomeModal } from "../pages/welcomeModal/welcomeModal";
import { LegendPage } from "../legend/legend";
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { PersonalDetailsService } from "../services/Form_Services/PersonDetailsService";
import { CoordService } from "../services/CoordService";
import { AuthService } from "../services/AuthService";

@Component({
  templateUrl: "app.html"
})
export class BikeMaps2 {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = MapPage;

    pages: Array<{title: string, component: any}>;

    legend: any = LegendPage;

    constructor(private authServie: AuthService, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private translateService: TranslateService, public modalCtrl: ModalController, public storageService: Storage, public personalDetailService: PersonalDetailsService, private coordService: CoordService) {
        this.initializeApp();

        // used for an example of ngFor and navigation
        this.pages = [
        { title: "List", component: ListPage }
        ];
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            if (window.statusbar) {
                if (this.platform.is("android")) {
                    this.statusBar.backgroundColorByHexString("#00b0aa");
                } else {
                    this.statusBar.styleLightContent();
                }
            }
            
            this.translateService.setDefaultLang('en');
            this.presentModal();
            this.personalDetailService.Initialize();
            this.coordService.Initialize();
            this.authServie.initialize();

            this.storageService.get("currentLanguage").then((val) => {
                if (val) {
                    this.translateService.use(val);
                } else {
                    this.translateService.use("en");
                }
            });
            this.splashScreen.hide();
        });
    }

  presentModal() {
    this.storageService.get('hideWelcome').then((val) => {
      if (!val) {
        const modal = this.modalCtrl.create(WelcomeModal);
        modal.present();
      }
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
