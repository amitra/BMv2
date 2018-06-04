import { Injectable } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class GenderService {

    language: string;
    gender: any;

    constructor(public translate : TranslateService) {
        this.initLanguage();
    }

    public initLanguage() {
        if (this.language !== this.translate.currentLang) {
            this.language = this.translate.currentLang;
            
            this.gender = [
                { key: undefined, text: '---------' },
                { key: 'M', text: this.translate.instant("COMMON_FORM.M") },
                { key: 'F', text: this.translate.instant("COMMON_FORM.F") },
                { key: 'Other', text: this.translate.instant("COMMON_FORM.OTHER") },
            ];
        }
    }
}