import { Component, OnInit } from "@angular/core";
import { ModalController, NavController } from "ionic-angular";
import { BirthMonthService } from "../../services/BirthMonthService";
import { BirthYearService } from "../../services/BirthYearService";
import { GenderService } from "../../services/GenderService";
import { CyclingFrequencyService } from "../../services/CyclingFrequencyService";
import { HazardFormService } from "../../services/Form_Services/HazardFormService";
import { IncidentFormService } from "../../services/Form_Services/IncidentFormService";
import { PersonalDetailsService } from "../../services/Form_Services/PersonDetailsService";
import { CoordService } from "../../services/CoordService";
import { DataService } from "../../services/DataService";
import { TermsAndConditionsModal } from "../../pages/termsAndConditionsModal/termsAndConditionsModal";
import { Events } from "ionic-angular";

@Component({
    selector: 'page-hazard',
    templateUrl: 'hazard.html'
})

export class HazardPage implements OnInit {
    detailsOpen: boolean = true;
    descriptionOpen: boolean = false;
    personalDetailsOpen: boolean = false;
    hazardGroupChoices = this.hazardFormService.responses;
    birthYearChoices = this.birthYearService.years;
    birthMonthChoices = this.birthMonthService.months;
    genderChoices = this.genderService.gender;
    cyclingFrequencyChoices = this.cyclingFrequencyService.frequency;
    sourceChoices = this.incidentFormService.sourceChoices;


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

    // Personal Details Pane
    selectedSourceChoice = this.sourceChoices[0];
    selectedSavePersonalDetails: boolean;
    selectedHazardBirthYear: any;
    selectedHazardBirthMonth: any;
    selectedHazardGender: any;
    selectedHazardCyclingFrequency: any

    // Validation flags
    dateAlert : boolean = false;
    timeAlert : boolean = false;
    hazardTypeAlert : boolean = false;
    hazardTermsChecked: boolean = false;

    constructor(private events: Events, private incidentFormService: IncidentFormService, public navCtrl: NavController, public birthYearService: BirthYearService, public birthMonthService: BirthMonthService, private hazardFormService: HazardFormService, private genderService: GenderService, private cyclingFrequencyService: CyclingFrequencyService, private personalDetailsService: PersonalDetailsService, private coordService: CoordService, private dataService: DataService, private modalCtrlr: ModalController) {
    }

    ngOnInit(): void {
        if (this.personalDetailsService.savePersonalDetails) {
            this.selectedSavePersonalDetails = this.personalDetailsService.savePersonalDetails;
            this.selectedHazardBirthMonth = this.personalDetailsService.birthMonth;
            this.selectedHazardBirthYear = this.personalDetailsService.birthYear;
            this.selectedHazardGender = this.personalDetailsService.gender;
            this.selectedHazardCyclingFrequency = this.personalDetailsService.frequency;
        }
        else
        {
            this.selectedSavePersonalDetails = false,
            this.selectedHazardBirthYear = this.birthYearChoices[0],
            this.selectedHazardBirthMonth = this.birthMonthChoices[0],
            this.selectedHazardGender = this.genderChoices[0],
            this.selectedHazardCyclingFrequency = this.cyclingFrequencyChoices[0]
        }
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

    saveDetails = () => {
        const details = {
            savePersonalDetails: this.selectedSavePersonalDetails,
            birthMonth: this.selectedHazardBirthMonth,
            birthYear: this.selectedHazardBirthYear,
            gender: this. selectedHazardGender,
            frequency: this.selectedHazardCyclingFrequency
        }

        this.personalDetailsService.SaveDetails(details);
    }

    
    submitHazard = () => {
        if (this.validateForm()) {
            this.saveDetails();
            this.coordService.dirty = true;
            const hazardForm = {
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        this.coordService.coordinates[0],
                        this.coordService.coordinates[1]
                    ]
                },
                "properties": {
                    "i_type": this.hazardDetails.selectedHazardType.key,
                    "date": this.hazardDetails.selectedDate + " " + this.hazardDetails.selectedTime,
                    "p_type": "hazard",
                    "details": this.description.details,
                    "age": this.selectedHazardBirthYear.key,
                    "birthmonth": this.selectedHazardBirthMonth.key,
                    "sex": this.selectedHazardGender.key,
                    "regular_cyclist": this.selectedHazardCyclingFrequency.key,
                    "source": this.selectedSourceChoice.key
                }
            };

            this.dataService.submitIncidentData("hazards", hazardForm)
                .subscribe(data => {
                    this.events.publish("pointAdded");
                }, error => {
                    console.log(error);
                });
            this.dismiss();
        }
    }

    cancelHazard = () => {
        this.dismiss();
    }

    dismiss = () => {
        this.navCtrl.pop();
    }

    validateForm() : boolean {
        if (this.hazardDetails.selectedDate === undefined || this.hazardDetails.selectedTime === undefined || this.hazardDetails.selectedHazardType.key === undefined) {
            this.dateAlert = this.hazardDetails.selectedDate === undefined ? true : false;
            this.timeAlert = this.hazardDetails.selectedTime === undefined ? true : false;
            this.hazardTypeAlert = this.hazardDetails.selectedHazardType.key === undefined ? true : false;
            return false;
        }
        else
        {
            this.dateAlert = false;
            this.timeAlert = false;
            this.hazardTypeAlert = false;
            return true;
        }
    }

    showTerms = () => {
        if (this.hazardTermsChecked) {
            const termsAndConditionsModal = this.modalCtrlr.create(TermsAndConditionsModal);
            termsAndConditionsModal.present();
        }
    }
    showTermsHyperlink = () => {
        const termsAndConditionsModal = this.modalCtrlr.create(TermsAndConditionsModal);
        termsAndConditionsModal.present();
    }
}