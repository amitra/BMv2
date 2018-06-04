import { Component, OnInit } from "@angular/core";
import { ModalController, NavController } from "ionic-angular";
import { CyclingFrequencyService } from "../../services/CyclingFrequencyService";
import { TheftFormService } from "../../services/Form_Services/TheftFormService";
import { IncidentFormService } from "../../services/Form_Services/IncidentFormService";
import { CoordService } from "../../services/CoordService";
import { DataService } from "../../services/DataService";
import { TermsAndConditionsModal } from "../../pages/termsAndConditionsModal/termsAndConditionsModal";
import { YesNoService } from "../../services/YesNoService";
import { Events } from "ionic-angular";
import { DateTimePickerService } from "../../services/DateTimePickerService";

@Component({
    selector: 'page-theft',
    templateUrl: 'theft.html'
})

export class TheftPage implements OnInit {
    detailsOpen: boolean = true;
    descriptionOpen: boolean = false;
    personalDetailsOpen: boolean = false;
    theftChoices = this.theftFormService.theftChoices;
    lockedChoices = this.theftFormService.lockedChoices;
    lockTypeChoices = this.theftFormService.lockTypeChoices;
    locationChoices = this.theftFormService.locationChoices;
    lightingChoices = this.theftFormService.lightingChoices;
    trafficChoices = this.theftFormService.trafficChoices;
    cyclingFrequencyChoices = this.cyclingFrequencyService.frequency;
    policeReportChoices = this.yesNoService.choices;
    insuranceClaimChoices = this.yesNoService.choices;
    sourceChoices = this.incidentFormService.sourceChoices;

    // Theft details pane
    theftDetails = {
        selectedDate: undefined,
        selectedTime: undefined,
        maxDate: new Date(),
        selectedTheftChoice: this.theftChoices[0],
        selectedLockedChoice: this.lockedChoices[0].items[0],
        selectedLockTypeChoice: this.lockTypeChoices[0],
        selectedLocationChoice: this.locationChoices[0],
        selectedLightingChoice: this.lightingChoices[0],
        selectedTrafficChoice: this.trafficChoices[0]
    };

    // Description pane
    description = {
        details: ""
    };

    // Personal Details Pane
    selectedSourceChoice: any = this.sourceChoices[0];
    selectedTheftCyclingFrequency: any = this.cyclingFrequencyService.frequency[0];
    selectedPoliceReportChoice: any = this.yesNoService.choices[0];
    policeReportNumber: string = "";
    selectedInsuranceClaimChoice: any = this.yesNoService.choices[0];
    insuranceClaimNumber: string = "";

    // Validation flags
    dateAlert : boolean = false;
    timeAlert : boolean = false;
    selectedTheftChoiceAlert : boolean = false;
    selectedLockedChoiceAlert : boolean = false;
    selectedLockTypeChoiceAlert : boolean = false;
    selectedLocationChoiceAlert : boolean = false;
    selectedLightingChoiceAlert : boolean = false;
    selectedTrafficChoiceAlert : boolean = false;

    theftTermsChecked: boolean = false;

    // DateTimePicker variables
    monthNames: any;
    monthShortNames: any;
    dayNames: any;
    dayShortNames: any;
    cancelText: string;
    doneText: string;

    constructor(private events: Events, public navCtrl: NavController, private incidentFormService: IncidentFormService, private theftFormService: TheftFormService, private cyclingFrequencyService: CyclingFrequencyService, private coordService: CoordService, private dataService: DataService, private modalCtrlr: ModalController, private yesNoService: YesNoService, public dtService: DateTimePickerService) {
    }

    ngOnInit(): void {
        this.monthNames = this.dtService.monthNames;
        this.monthShortNames = this.dtService.monthShortNames;
        this.dayNames = this.dtService.dayNames;
        this.dayShortNames = this.dtService.dayShortNames;
        this.cancelText = this.dtService.cancelText;
        this.doneText = this.dtService.doneText;
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
        if (this.validateForm()) {
            this.coordService.dirty = true;
            const theftForm = {
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        this.coordService.coordinates[0],
                        this.coordService.coordinates[1]
                    ]
                },
                "properties": {
                    "i_type": this.theftDetails.selectedTheftChoice.key,
                    "date": this.theftDetails.selectedDate + " " + this.theftDetails.selectedTime,
                    "p_type": "theft",
                    "details": this.description.details,
                    "how_locked": this.theftDetails.selectedLockedChoice.key,
                    "lock": this.theftDetails.selectedLockTypeChoice.key,
                    "locked_to": this.theftDetails.selectedLocationChoice.key,
                    "lighting": this.theftDetails.selectedLightingChoice.key,
                    "traffic": this.theftDetails.selectedTrafficChoice.key,
                    "police_report": this.selectedPoliceReportChoice.key,
                    "police_report_num": this.policeReportNumber,
                    "insurance_claim": this.selectedInsuranceClaimChoice.key,
                    "insurance_claim_num": this.insuranceClaimNumber,
                    "regular_cyclist": this.selectedTheftCyclingFrequency.key,
                    "source": this.selectedSourceChoice.key,
                }
            };

            this.dataService.submitIncidentData("thefts", theftForm)
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
        if (this.theftDetails.selectedDate === undefined ||
            this.theftDetails.selectedTime === undefined ||
            this.theftDetails.selectedTheftChoice.key === undefined || 
            this.theftDetails.selectedLockedChoice.key === undefined ||
            this.theftDetails.selectedLockTypeChoice.key === undefined ||
            this.theftDetails.selectedLocationChoice.key === undefined ||
            this.theftDetails.selectedLightingChoice.key === undefined ||
            this.theftDetails.selectedTrafficChoice.key === undefined) {
            this.dateAlert = this.theftDetails.selectedDate === undefined ? true : false;
            this.timeAlert = this.theftDetails.selectedTime === undefined ? true : false;
            this.selectedTheftChoiceAlert = this.theftDetails.selectedTheftChoice.key === undefined ? true : false;
            this.selectedLockedChoiceAlert = this.theftDetails.selectedLockedChoice.key === undefined ? true : false;
            this.selectedLockTypeChoiceAlert = this.theftDetails.selectedLockTypeChoice.key === undefined ? true : false;
            this.selectedLocationChoiceAlert = this.theftDetails.selectedLocationChoice.key === undefined ? true : false;
            this.selectedLightingChoiceAlert = this.theftDetails.selectedLightingChoice.key === undefined ? true : false;
            this.selectedTrafficChoiceAlert = this.theftDetails.selectedTrafficChoice.key === undefined ? true : false;
            return false;
        }
        else
        {
            this.dateAlert = false;
            this.timeAlert = false;
            this.selectedTheftChoiceAlert = false;
            this.selectedLockedChoiceAlert = false;
            this.selectedLockTypeChoiceAlert = false;
            this.selectedLocationChoiceAlert = false;
            this.selectedLightingChoiceAlert = false;
            this.selectedTrafficChoiceAlert = false;
            return true;
        }
    }

    showTerms = () => {
        if (this.theftTermsChecked) {
            const termsAndConditionsModal = this.modalCtrlr.create(TermsAndConditionsModal);
            termsAndConditionsModal.present();
        }
    }
}