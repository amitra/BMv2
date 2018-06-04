import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class YesNoService {

    language: string;
    choices: any;
       
    constructor(private translate: TranslateService) {
        this.initLanguage();
    }

    public initLanguage() {
        if (this.language !== this.translate.currentLang) {
            this.language = this.translate.currentLang;

            this.choices = [
                { text:'---------' },
                { key: true, text: this.translate.instant("COMMON_FORM.YES") },
                { key: false, text: this.translate.instant("COMMON_FORM.NO")}
            ];
        }
    }
} 