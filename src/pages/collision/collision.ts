
import { Component, OnInit } from "@angular/core";
import { ModalController, NavController } from "ionic-angular";
import { BirthMonthService } from "../../services/BirthMonthService";
import { BirthYearService } from "../../services/BirthYearService";
import { GenderService } from "../../services/GenderService";
import { CyclingFrequencyService } from "../../services/CyclingFrequencyService";
import { IncidentFormService } from "../../services/Form_Services/IncidentFormService";
import { PersonalDetailsService } from "../../services/Form_Services/PersonDetailsService";
import { CoordService } from "../../services/CoordService";
import { DataService } from "../../services/DataService";
import { TermsAndConditionsModal } from "../../pages/termsAndConditionsModal/termsAndConditionsModal";
import { Events } from "ionic-angular";

@Component({
    selector: 'page-collision',
    templateUrl: 'collision.html'
})


export class CollisionPage implements OnInit {
    detailsOpen: boolean = true;
    conditionOpen: boolean = false;
    descriptionOpen: boolean = false;
    personalDetailsOpen: boolean = false;
    incidentTypeChoices = this.incidentFormService.incidentChoices;
    incidentObjectChoices = this.incidentFormService.objectChoices;
    incidentInjuryChoices = this.incidentFormService.injuredChoices;
    incidentImpactChoices = this.incidentFormService.impactChoices;
    incidentPurposeChoices = this.incidentFormService.purposeChoices;
    incidentInvolvementChoices = this.incidentFormService.incidentInvolvementChoices;
    incidentConditionsChoices = this.incidentFormService.conditionChoices;
    sightConditionsChoices = this.incidentFormService.sightConditionsChoices;
    carsParkedChoices = this.incidentFormService.carsParkedChoices;
    ridingOnChoices = this.incidentFormService.ridingOnChoices;
    lightChoices = this.incidentFormService.lightChoices;
    terrainChoices = this.incidentFormService.terrainChoices;
    directionChoices = this.incidentFormService.directionChoices;
    turningChoices = this.incidentFormService.turningChoices;
    sourceChoices = this.incidentFormService.sourceChoices;
    birthYearChoices = this.birthYearService.years;
    birthMonthChoices = this.birthMonthService.months;
    genderChoices = this.genderService.gender;
    cyclingFrequencyChoices = this.cyclingFrequencyService.frequency;
    bicycleTypeChoices = this.incidentFormService.bicycleTypeChoices;
    eBikeChoices = this.incidentFormService.eBikeChoices;
    helmetChoices = this.incidentFormService.helmetChoices;
    intoxicatedChoices = this.incidentFormService.intoxicatedChoices;

    // Incident details pane
    incidentDetails = {
        selectedDate: undefined,
        selectedTime: undefined,
        maxDate: new Date(),
        selectedIncidentType: { key: undefined, text: "---------"},
        selectedObjectType: { key: undefined, text: "---------"},
        selectedInjuryType: { key: undefined, text: "---------"},
        selectedImpactType: { key: undefined, text: "---------"},
        selectedPurposeType: { key: undefined, text: "---------"},
        selectedInvolvementType: { key: undefined, text: "---------"}
    };

    // Conditions pane
    conditions = {
        selectedConditions: this.incidentConditionsChoices[0],
        selectedSightConditions: this.sightConditionsChoices[0],
        selectedCarsParked: this.carsParkedChoices[0],
        selectedRidingOn:  this.ridingOnChoices[0].items[0],
        selectedLight: this.lightChoices[0],
        selectedTerrain: this.terrainChoices[0],
        selectedDirection: this.directionChoices[0],
        selectedTurning: this.turningChoices[0]
    }

    // Description pane
    description = {
        details: ""
    };

    // Personal Details Pane
    selectedSavePersonalDetails: boolean;
    selectedSourceChoice = this.sourceChoices[0];
    selectedIncidentBirthYear: any;
    selectedIncidentBirthMonth: any;
    selectedIncidentGender: any;
    selectedIncidentCyclingFrequency: any;
    selectedBicycleType = this.bicycleTypeChoices[0];
    selectedEbike = this.eBikeChoices[0];
    selectedHelmet = this.helmetChoices[0];
    selectedIntoxicated = this.intoxicatedChoices[0];


    // Validation flags
    dateAlert: boolean = false;
    timeAlert: boolean = false;
    incidentTypeAlert: boolean = false;
    objectTypeAlert: boolean = false;
    injuredAlert: boolean = false;
    impactAlert: boolean = false;

    incidentTermsChecked: boolean = false;

    constructor(private events: Events, public navCtrl: NavController, public birthYearService: BirthYearService, public birthMonthService: BirthMonthService, private incidentFormService: IncidentFormService, private genderService: GenderService, private cyclingFrequencyService: CyclingFrequencyService, private personalDetailsService: PersonalDetailsService, private coordService: CoordService, private dataService: DataService, private modalCtrlr: ModalController) {
    }

    ngOnInit(): void {
        if (this.personalDetailsService.savePersonalDetails) {
            this.selectedSavePersonalDetails = this.personalDetailsService.savePersonalDetails;
            this.selectedIncidentBirthMonth = this.personalDetailsService.birthMonth;
            this.selectedIncidentBirthYear = this.personalDetailsService.birthYear;
            this.selectedIncidentGender = this.personalDetailsService.gender;
            this.selectedIncidentCyclingFrequency = this.personalDetailsService.frequency;
        }
        else
        {
            this.selectedSavePersonalDetails = false,
            this.selectedIncidentBirthYear = this.birthYearChoices[0],
            this.selectedIncidentBirthMonth = this.birthMonthChoices[0],
            this.selectedIncidentGender = this.genderChoices[0],
            this.selectedIncidentCyclingFrequency = this.cyclingFrequencyChoices[0]
        }
    }

    toggleSection = (section) => {
        switch (section) {
            case "detailsOpen": {
                this.detailsOpen = !this.detailsOpen;
                break;
            }
            case "conditionOpen": {
                this.conditionOpen = !this.conditionOpen;
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
            birthMonth: this.selectedIncidentBirthMonth,
            birthYear: this.selectedIncidentBirthYear,
            gender: this. selectedIncidentGender,
            frequency: this.selectedIncidentCyclingFrequency
        }

        this.personalDetailsService.SaveDetails(details);
    }
    
    submitIncident = () => {
        if (this.validateForm()) {
            this.saveDetails();
            this.coordService.dirty = true;
            const incidentForm = {
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        this.coordService.coordinates[0],
                        this.coordService.coordinates[1]
                    ]
                },
                "properties": {
                    "i_type": this.incidentDetails.selectedIncidentType.key,
                    "date": this.incidentDetails.selectedDate + " " + this.incidentDetails.selectedTime,
                    "p_type": "collision",
                    "incident_with": this.incidentDetails.selectedObjectType.key,
                    "injury": this.incidentDetails.selectedInjuryType.key,
                    "impact": this.incidentDetails.selectedImpactType.key,
                    "trip_purpose": this.incidentDetails.selectedPurposeType.key,
                    "personal_involvement": this.incidentDetails.selectedInvolvementType.key,
                    "road_conditions": this.conditions.selectedConditions.key,
                    "sightlines": this.conditions.selectedSightConditions.key,
                    "cars_on_roadside": this.conditions.selectedCarsParked.key,
                    "riding_on": this.conditions.selectedRidingOn.key,
                    "bike_lights": this.conditions.selectedLight.key,
                    "terrain": this.conditions.selectedTerrain.key,
                    "direction": this.conditions.selectedDirection.key,
                    "turning": this.conditions.selectedTurning.key,
                    "details": this.description.details,
                    "source": this.selectedSourceChoice.key,
                    "age": this.selectedIncidentBirthYear.key,
                    "birthmonth": this.selectedIncidentBirthMonth.key,
                    "sex": this.selectedIncidentGender.key,
                    "regular_cyclist": this.selectedIncidentCyclingFrequency.key,
                    "bicycle_type": this.selectedBicycleType.key,
                    "ebike": this.selectedEbike.key,
                    "helmet": this.selectedHelmet.key,
                    "intoxicated": this.selectedIntoxicated.key,
                }
            };

            this.dataService.submitIncidentData("collisions", incidentForm)
                .subscribe(data => {
                    this.events.publish("pointAdded");
                }, error => {
                    console.log(error);
                });
            this.dismiss();
        }
    }


    cancelIncident = () => {
        this.dismiss();
    }

    dismiss = () => {
        this.navCtrl.pop();
    }
    
    validateForm() : boolean {
        if (this.incidentDetails.selectedDate === undefined || this.incidentDetails.selectedTime === undefined || this.incidentDetails.selectedIncidentType.key === undefined ||
                this.incidentDetails.selectedObjectType.key === undefined || this.incidentDetails.selectedInjuryType.key === undefined || this.incidentDetails.selectedImpactType.key === undefined) {
            this.dateAlert = this.incidentDetails.selectedDate === undefined ? true : false;
            this.timeAlert = this.incidentDetails.selectedTime === undefined ? true : false;
            this.incidentTypeAlert = this.incidentDetails.selectedIncidentType.key === undefined ? true : false;
            this.objectTypeAlert = this.incidentDetails.selectedObjectType.key === undefined ? true : false;
            this.injuredAlert = this.incidentDetails.selectedInjuryType.key === undefined ? true : false;
            this.impactAlert = this.incidentDetails.selectedImpactType.key === undefined ? true : false;
            return false;
        }
        else
        {
            this.dateAlert = false;
            this.timeAlert = false;
            this.incidentTypeAlert = false;
            this.objectTypeAlert = false;
            this.injuredAlert = false;
            this.impactAlert = false;
            return true;
        }
    }

    showTerms = () => {
        if (this.incidentTermsChecked) {
            const termsAndConditionsModal = this.modalCtrlr.create(TermsAndConditionsModal);
            termsAndConditionsModal.present();
        }
    }
}