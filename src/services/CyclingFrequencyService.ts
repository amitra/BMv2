import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class CyclingFrequencyService {

    language: string;
    frequency: any;

    public getFrequency = () => {
        return this.frequency;
    }

    constructor(public translate: TranslateService) {
        this.initLanguage();
    }

    public initLanguage() {
        if (this.language !== this.translate.currentLang) {
            this.language = this.translate.currentLang;

            this.frequency = [
                { key: undefined, text: "---------" },
                { key: "Y", text: this.translate.instant("COMMON_FORM.YES") },
                { key: "N", text: this.translate.instant("COMMON_FORM.NO") },
                { key: "I don't know", text: this.translate.instant("COMMON_FORM.DONT_KNOW") }
            ];
        }
    }
}