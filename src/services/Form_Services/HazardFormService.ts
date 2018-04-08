import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class HazardFormService {

    responses = [
        {
            text: "Infrastructure",
            items: [
                { key: undefined, text: "---------" },
                { key: "Curb", text: this.translate.instant("HAZARD.CURB") },
                { key: "Train track", text: this.translate.instant("HAZARD.TRAIN_TRACK") },
                { key: "Pothole", text: this.translate.instant("HAZARD.POTHOLE") },
                { key: "Road surface", text: this.translate.instant("HAZARD.ROAD_SURFACE") },
                { key: "Poor signage", text: this.translate.instant("HAZARD.POOR_SIGNAGE") },
                { key: "Speed limits", text: this.translate.instant("HAZARD.SPEED_LIMITS") },
                { key: "Blind corner", text: this.translate.instant("HAZARD.BLIND_CORNER") },
                { key: "Bike lane disappears", text: this.translate.instant("HAZARD.BIKE_LANE_DISAPPEARS") },
                { key: "Vehicles enter exit", text: this.translate.instant("HAZARD.VEHICLES_ENTER_EXIT") },
                { key: "Dooring risk", text: this.translate.instant("HAZARD.DOORING_RISK") },
                { key: "Vehicle in bike lane", text: this.translate.instant("HAZARD.VEHICLE_IN_BIKE_LANE") },
                { key: "Dangerous intersection", text: this.translate.instant("HAZARD.DANGEROUS_INTERSECTION") },
                { key: "Dangerous vehicle left turn", text: this.translate.instant("HAZARD.DANGEROUS_VEHICLE_LEFT_TURN") },
                { key: "Dangerous vehicle right turn", text: this.translate.instant("HAZARD.DANGEROUS_VEHICLE_RIGHT_TURN") },
                { key: "Sensor does not detect bikes", text: this.translate.instant("HAZARD.SENSOR_DOES_NOT_DETECT_BIKES") },
                { key: "Steep hill", text: this.translate.instant("HAZARD.STEEP_HILL") },
                { key: "Narrow road", text: this.translate.instant("HAZARD.NARROW_ROAD") },
                { key: "Pedestrian conflict zone", text: this.translate.instant("HAZARD.PEDESTRIAN_CONFLICT_ZONE") },
                { key: "Other infrastructure", text: this.translate.instant("HAZARD.OTHER_INFRASTRUCTURE") }
            ]
        },
        {
            text: "Environmental",
            items: [
                { key: "Icy/Snowy", text: "Icy/Snowy" },
                { key: "Poor visibility", text: "Poor visibility" },
                { key: "Broken glass", text: "Broken glass on road" },
                { key: "Wet leaves", text: "Wet leaves on road" },
                { key: "Gravel rocks or debris", text: "Gravel, rocks or debris on road" },
                { key: "Construction", text: "Construction" },
                { key: "Other", text: "Other (Please describe)" }
            ]
        }];

    constructor(private translate: TranslateService) {
    }

    public getResponses = () => {
        return this.responses;
    }
} 