import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { BirthMonthService } from "../../services/BirthMonthService";
import { BirthYearService } from "../../services/BirthYearService";
import { GenderService } from "../../services/GenderService";
import { CyclingFrequencyService } from "../../services/CyclingFrequencyService";
import { HazardFormService } from "../../services/Form_Services/HazardFormService";

@Component({
    selector: 'page-hazard',
    templateUrl: 'hazard.html'
})

export class HazardPage {
    detailsOpen: boolean = true;
    descriptionOpen: boolean = false;
    personalDetailsOpen: boolean = false;
    hazardGroupChoices = this.hazardFormService.responses;
    tempHazardChoices = this.hazardGroupChoices[0].items;
    birthYearChoices = this.birthYearService.years;
    birthMonthChoices = this.birthMonthService.months;
    genderChoices = this.genderService.gender;
    cyclingFrequencyChoices = this.cyclingFrequencyService.frequency;


    // Hazard details pane
    hazardDetails = {
        selectedDate: undefined,
        selectedTime: undefined,
        maxDate: new Date(),
        selectedHazardType: this.hazardGroupChoices[0].items[0]
    };


    // Description pane
    description = {
        details: ""
    };

    // Personal details pane
    personalDetails = {
        selectedHazardBirthYear: this.birthYearChoices[0],
        selectedHazardBirthMonth: this.birthMonthChoices[0],
        selectedHazardGender: this.genderChoices[0],
        selectedHazardCyclingFrequency: this.cyclingFrequencyChoices[0]
    };

    constructor(public navCtrl: NavController, public birthYearService: BirthYearService, public birthMonthService: BirthMonthService, private hazardFormService: HazardFormService, private genderService: GenderService, private cyclingFrequencyService: CyclingFrequencyService) {
    }

    toggleSection = (section) => {
        switch (section) {
            case "detailsOpen": {
                this.detailsOpen = !this.detailsOpen;
                break;
            }
            case "descriptionOpen": {
                this.descriptionOpen = !this.descriptionOpen;
                break;
            }
            case "personalDetailsOpen": {
                this.personalDetailsOpen = !this.personalDetailsOpen
                break;
            }
            default: {
            }
        }
        return;
    }

    submitHazard = () => {
        console.log("Submitting a form");
        this.dismiss();
    }

    cancelHazard = () => {
        this.dismiss();
    }

    dismiss = () => {
        this.navCtrl.pop();
    }
}