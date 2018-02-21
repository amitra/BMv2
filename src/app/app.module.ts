import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { BikeMaps2 } from "./app.component";
import { MapPage } from "../map/map";
import { WelcomeModal } from "../pages/welcomeModal/welcomeModal";
import { LegendPage } from "../legend/legend";
import { HomePage } from "../pages/home/home";
import { ListPage } from "../pages/list/list";
import { PopoverPage } from "../pages/popover/popover";
import { HazardPage } from "../pages/hazard/hazard";
import { IconService } from "../services/IconService";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Http, HttpModule } from "@angular/http";
import { IonicStorageModule } from "@ionic/storage";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Vibration } from "@ionic-native/vibration";
import { DataService } from "../services/DataService";
import { PopupService } from "../services/PopupService";
import { BirthMonthService } from "../services/BirthMonthService";
import { BirthYearService } from "../services/BirthYearService";
import { GenderService } from "../services/GenderService";
import { CyclingFrequencyService } from "../services/CyclingFrequencyService";
import { BasicSelect } from "../components/basic_select/basic_select";
import { BasicSelectItems } from "../components/basic_select_items/basic_select_items";
import { HazardFormService } from "../services/Form_Services/HazardFormService";

export function TranslateLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    BikeMaps2,
    HomePage,
    ListPage,
    MapPage,
    WelcomeModal,
    PopoverPage,
    LegendPage,
    HazardPage,
    BasicSelect,
    BasicSelectItems
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(BikeMaps2),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (TranslateLoaderFactory),
        deps: [Http]
      }
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    BikeMaps2,
    HomePage,
    ListPage,
    MapPage,
    WelcomeModal,
    PopoverPage,
    LegendPage,
    HazardPage,
    BasicSelectItems
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Vibration,
    IconService,
    DataService,
    PopupService,
    BirthYearService,
    BirthMonthService,
    GenderService,
    CyclingFrequencyService,
    HazardFormService
  ]
})
export class AppModule {}
