import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class YesNoService {

    choices = [
        { text:'---------' },
        { key: true, text: this.translate.instant("COMMON_FORM.YES") },
        { key: false, text: this.translate.instant("COMMON_FORM.NO")}
    ];
       
    constructor(private translate: TranslateService) {
    }
} 