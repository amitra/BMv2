import { Injectable } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class DateTimePickerService {

    language: string;
    monthNames: any;
    monthShortNames: any;
    dayNames: any;
    dayShortNames: any;
    cancelText: string;
    doneText: string;

    constructor(public translate: TranslateService) {
        this.initLanguage();
    }

    public initLanguage() {
        if (this.language !== this.translate.currentLang) {
            this.language = this.translate.currentLang;

            this.monthNames = [
                this.translate.instant("COMMON_FORM.1"),
                this.translate.instant("COMMON_FORM.2"),
                this.translate.instant("COMMON_FORM.3"),
                this.translate.instant("COMMON_FORM.4"),
                this.translate.instant("COMMON_FORM.5"),
                this.translate.instant("COMMON_FORM.6"),
                this.translate.instant("COMMON_FORM.7"),
                this.translate.instant("COMMON_FORM.8"),
                this.translate.instant("COMMON_FORM.9"),
                this.translate.instant("COMMON_FORM.10"),
                this.translate.instant("COMMON_FORM.11"),
                this.translate.instant("COMMON_FORM.12")
            ];

            this.monthShortNames = [
                this.translate.instant("COMMON_FORM.1_SHORT"),
                this.translate.instant("COMMON_FORM.2_SHORT"),
                this.translate.instant("COMMON_FORM.3_SHORT"),
                this.translate.instant("COMMON_FORM.4_SHORT"),
                this.translate.instant("COMMON_FORM.5_SHORT"),
                this.translate.instant("COMMON_FORM.6_SHORT"),
                this.translate.instant("COMMON_FORM.7_SHORT"),
                this.translate.instant("COMMON_FORM.8_SHORT"),
                this.translate.instant("COMMON_FORM.9_SHORT"),
                this.translate.instant("COMMON_FORM.10_SHORT"),
                this.translate.instant("COMMON_FORM.11_SHORT"),
                this.translate.instant("COMMON_FORM.12_SHORT")
            ];

            this.dayNames = [
                this.translate.instant("COMMON_FORM.MONDAY"),
                this.translate.instant("COMMON_FORM.TUESDAY"),
                this.translate.instant("COMMON_FORM.WEDNESDAY"),
                this.translate.instant("COMMON_FORM.THURSDAY"),
                this.translate.instant("COMMON_FORM.FRIDAY"),
                this.translate.instant("COMMON_FORM.SATURDAY"),
                this.translate.instant("COMMON_FORM.SUNDAY")
            ];

            this.dayShortNames = [
                this.translate.instant("COMMON_FORM.MONDAY_SHORT"),
                this.translate.instant("COMMON_FORM.TUESDAY_SHORT"),
                this.translate.instant("COMMON_FORM.WEDNESDAY_SHORT"),
                this.translate.instant("COMMON_FORM.THURSDAY_SHORT"),
                this.translate.instant("COMMON_FORM.FRIDAY_SHORT"),
                this.translate.instant("COMMON_FORM.SATURDAY_SHORT"),
                this.translate.instant("COMMON_FORM.SUNDAY_SHORT")
            ];

            this.cancelText = this.translate.instant("COMMON_FORM.CANCEL_BUTTON"),
            this.doneText = this.translate.instant("COMMON_FORM.DONE_BUTTON")
        }
    }
}