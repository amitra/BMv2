import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "../../services/AuthService";
import { HazardFormService } from "../../services/Form_Services/HazardFormService";
import { IncidentFormService } from "../../services/Form_Services/IncidentFormService";
import { TheftFormService } from "../../services/Form_Services/TheftFormService";
import { BirthMonthService } from "../../services/BirthMonthService";
import { CyclingFrequencyService } from "../../services/CyclingFrequencyService";
import { GenderService } from "../../services/GenderService";
import { YesNoService } from "../../services/YesNoService";
import { DateTimePickerService } from "../../services/DateTimePickerService";

@Component({
  selector: 'settings-page',
  templateUrl: 'settings.html'
})

export class SettingsPage implements OnInit {

    isAuthenticated: boolean;
    receiveNotifications: boolean = false;
    currentLanguage: any;
    selectOptions: any = {
        title: this.translateService.instant("SETTINGS.SELECT_LANGUAGE"),

    };
    cancelText: string = this.translateService.instant("SETTINGS.CANCEL");

    constructor(private authService: AuthService, private storageService: Storage, private translateService: TranslateService, private hazardFormService: HazardFormService, private incidentFormService: IncidentFormService, private theftFormService: TheftFormService, private birthMonthService: BirthMonthService, private cyclingFrequencyService: CyclingFrequencyService, private genderService: GenderService, private yesNoService: YesNoService, public dtService: DateTimePickerService) {  
        this.isAuthenticated = this.authService.isAuthenticated;
    }

    ngOnInit():void {
        this.currentLanguage = this.translateService.currentLang;
        this.storageService.get("receiveNotifications").then((val) => {
            if (val){
                this.receiveNotifications = val;
            }
        });
    }

    onLanguageChange = (evt) => {
        this.translateService.use(evt)
        this.storageService.set("currentLanguage", evt);
        this.updateTranslations();
    }

    updateTranslations = () => {
        this.hazardFormService.initLanguage();
        this.incidentFormService.initLanguage();
        this.theftFormService.initLanguage();
        this.birthMonthService.initLanguage();
        this.cyclingFrequencyService.initLanguage();
        this.genderService.initLanguage();
        this.yesNoService.initLanguage();
        this.dtService.initLanguage();
    }


    toggleAlerts = () => {
        this.storageService.set("receiveNotifications", this.receiveNotifications);
    }
}