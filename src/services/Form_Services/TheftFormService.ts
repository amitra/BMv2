import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class TheftFormService {

    theftChoices = [
        { key: undefined, text: "---------" },
        { key: 'Bike (value < $1000)', text: this.translate.instant("THEFT.LOW_VALUE") },
        { key: 'Bike (value >= $1000)', text: this.translate.instant("THEFT.HIGH_VALUE") },
        { key: 'Major bike component', text: this.translate.instant("THEFT.MAJOR") },
        { key: 'Minor bike component', text: this.translate.instant("THEFT.MINOR") }
    ];

    lockedChoices = [
        {
            text: 'Yes',
            items: [
                { key: undefined, text: "---------" },
                { key: 'Frame locked', text: this.translate.instant("THEFT.FRAME_ONLY") },
                { key: 'Frame and tire locked', text: this.translate.instant("THEFT.FRAME_TIRE") },
                { key: 'Frame and both tires locked', text: this.translate.instant("THEFT.TIRES") },
                { key: 'Tire(s) locked', text: this.translate.instant("THEFT.TIRES") }
            ]
        },
        {
            text: 'No',
            items: [
                { key: 'Not locked', text: this.translate.instant("THEFT.NOT_LOCKED") }
            ]
        }
    ];

    lockTypeChoices = [
        { key: undefined, text: "---------" },
        { key: 'U-Lock', text: this.translate.instant("THEFT.ULOCK") },
        { key: 'Cable lock', text: this.translate.instant("THEFT.CABLE") },
        { key: 'U-Lock and cable', text: this.translate.instant("THEFT.ULOCK_CABLE") },
        { key: 'Padlock', text: this.translate.instant("THEFT.PADLOCK")},
        { key: 'NA', text: this.translate.instant("THEFT.NOT_LOCKED") }
    ];

    locationChoices = [
        { key: undefined, text: "---------" },
        { key: 'Outdoor bike rack', text: this.translate.instant("THEFT.OUTDOOR_BIKERACK") },
        { key: 'Indoor bike rack', text: this.translate.instant("THEFT.INDOOR_BIKERACK") },
        { key: 'Bike locker', text: this.translate.instant("THEFT.BIKE_LOCKER") },
        { key: 'Street sign', text: this.translate.instant("THEFT.STREET_SIGN") },
        { key: 'Fence/railing', text: this.translate.instant("THEFT.FENCE") },
        { key: 'Bench', text: this.translate.instant("THEFT.BENCH") },
        { key: 'Indoors/lobby', text: this.translate.instant("THEFT.INSIDE_BUILDING") },
        { key: 'Other', text: this.translate.instant("THEFT.OTHER") }
    ];

    lightingChoices = [
        { key: undefined, text: "---------" },
        { key: 'Good', text: this.translate.instant("THEFT.WELL_LIT") },
        { key: 'Moderate', text: this.translate.instant("THEFT.MOD_LIT") },
        { key: 'Poor', text: this.translate.instant("THEFT.POOR_LIT") },
        { key: "I don't know", text: this.translate.instant("THEFT.DONT_KNOW") }
    ];

    trafficChoices = [
        { key: undefined, text: "---------" },
        { key: 'Very High', text: this.translate.instant("THEFT.VERY_HIGH") },
        { key: 'High', text: this.translate.instant("THEFT.HIGH") },
        { key: 'Medium', text: this.translate.instant("THEFT.MEDIUM") },
        { key: 'Low', text: this.translate.instant("THEFT.LOW") },
        { key: 'Very Low', text: this.translate.instant("THEFT.VERY_LOW") },
        { key: "I don't know", text: this.translate.instant("THEFT.DONT_KNOW") }
    ];

    constructor(private translate: TranslateService) {
    }
} 