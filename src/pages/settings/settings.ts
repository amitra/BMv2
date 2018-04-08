import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'settings-page',
  templateUrl: 'settings.html'
})

export class SettingsPage implements OnInit {

    currentLanguage: any;
    selectOptions: any = {
        title: this.translateService.instant("SETTINGS.SELECT_LANGUAGE"),

    };
    cancelText: string = this.translateService.instant("SETTINGS.CANCEL");

    constructor(private storageService: Storage, private translateService: TranslateService) {  
    }

    ngOnInit():void {
        this.currentLanguage = this.translateService.currentLang;
    }

    onLanguageChange = (evt) => {
        this.translateService.use(evt)
        this.storageService.set("currentLanguage", evt);
    }
}