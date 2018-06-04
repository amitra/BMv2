import { Injectable } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class BirthMonthService {

    language: string;
    months: any;

    public getMonths() {
        return this.months;
    }

    constructor(public translate: TranslateService) {
        this.initLanguage();
    }

    public initLanguage() {
        if (this.language !== this.translate.currentLang) {
            this.language = this.translate.currentLang;

            this.months = [
                { key: undefined, text: '---------' },
                { key: '1', text: this.translate.instant("COMMON_FORM.1") },
                { key: '2', text: this.translate.instant("COMMON_FORM.2") },
                { key: '3', text: this.translate.instant("COMMON_FORM.3") },
                { key: '4', text: this.translate.instant("COMMON_FORM.4") },
                { key: '5', text: this.translate.instant("COMMON_FORM.5") },
                { key: '6', text: this.translate.instant("COMMON_FORM.6") },
                { key: '7', text: this.translate.instant("COMMON_FORM.7") },
                { key: '8', text: this.translate.instant("COMMON_FORM.8") },
                { key: '9', text: this.translate.instant("COMMON_FORM.9") },
                { key: '10', text: this.translate.instant("COMMON_FORM.10") },
                { key: '11', text: this.translate.instant("COMMON_FORM.11") },
                { key: '12', text: this.translate.instant("COMMON_FORM.12") },
            ];
        }
    }
}