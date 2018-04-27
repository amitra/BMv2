import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "../../services/AuthService";

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

    constructor(private authService: AuthService, private storageService: Storage, private translateService: TranslateService) {  
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
    }

    toggleAlerts = () => {
        this.storageService.set("receiveNotifications", this.receiveNotifications);
    }
}