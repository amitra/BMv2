import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class CyclingFrequencyService {
    frequency = [
        { key: " ---------", text: "---------" },
        { key: "Y", text: this.translate.instant("COMMON_FORM.YES") },
        { key: "N", text: this.translate.instant("COMMON_FORM.NO") },
        { key: "I don't know", text: this.translate.instant("COMMON_FORM.DONT_KNOW") }
    ]

    public getFrequency = () => {
        return this.frequency;
    }

    constructor(public translate: TranslateService) {
    }
}