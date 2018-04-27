import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class IncidentFormService {

    incidentChoices = [
        {
            text: this.translate.instant("INCIDENT.COLLISION_TITLE"),
            items: [
                { key: 'Collision with stationary object or vehicle', text: this.translate.instant("INCIDENT.COLLISION_STATIONARY") },
                { key: 'Collision with moving object or vehicle', text: this.translate.instant("INCIDENT.COLLISION_MOVING")}
            ]
        },
        {
            text: this.translate.instant("INCIDENT.FALL_TITLE"),
            items: [
                { key: 'Fall', text: this.translate.instant("INCIDENT.FALL") }
            ]
        }
    ];

    nearmissChoices = [
        {
            text: this.translate.instant("INCIDENT.NEAR_MISS_TITLE"),
            items: [
                { key: 'Near collision with stationary object or vehicle', text: this.translate.instant("INCIDENT.NEAR_MISS_STATIONARY") },
                { key: 'Near collision with moving object or vehicle', text: this.translate.instant("INCIDENT.NEAR_MISS_MOVING") }
            ]
        }
    ];

    objectChoices = [
        {
            text: this.translate.instant("INCIDENT.VEHICLE"),
            items: [
                { key: 'Vehicle, head on', text: this.translate.instant("INCIDENT.HEAD_ON") },
                { key: 'Vehicle, side', text: this.translate.instant("INCIDENT.SIDE_IMPACT") },
                { key: 'Vehicle, angle', text: this.translate.instant("INCIDENT.ANGLE_IMPACT") },
                { key: 'Vehicle, rear end', text: this.translate.instant("INCIDENT.READ_END") },
                { key: 'Vehicle, open door', text: this.translate.instant("INCIDENT.DOORING") }
            ]
        },
        {
            text: this.translate.instant("INCIDENT.PERSON_ANIMAL"),
            items: [
                { key: 'Another cyclist', text: this.translate.instant("INCIDENT.ANOTHER_CYCLIST") },
                { key: 'Pedestrian', text: this.translate.instant("INCIDENT.PEDESTRIAN") },
                { key: 'Animal', text: this.translate.instant("INCIDENT.ANIMAL") }
            ]
        },
        {
            text: this.translate.instant("INCIDENT.INFRASTRUCUTRE"),
            items: [
                { key: 'Curb', text: this.translate.instant("INCIDENT.CURB") },
                { key: 'Train Tracks', text: this.translate.instant("INCIDENT.TRAINTRACKS") },
                { key: 'Pothole', text: this.translate.instant("INCIDENT.POTHOLE") },
                { key: 'Lane divider', text: this.translate.instant("INCIDENT.LANE_DIVIDER") },
                { key: 'Sign/Post', text: this.translate.instant("INCIDENT.SIGN_POST") },
                { key: 'Roadway', text: this.translate.instant("INCIDENT.ROADWAY") }
            ]
        },
        {
            text: this.translate.instant("INCIDENT.OTHER_TITLE"),
            items: [
                { key: 'Other', text: this.translate.instant("INCIDENT.OTHER") }
            ]
        }
    ];

    injuredChoices = [
        {
            text: this.translate.instant("INCIDENT.YES"),
            items: [
                { key: 'Injury, no treatment', text: this.translate.instant("INCIDENT.INJURY_NO_TREATMENT") },
                { key: 'Injury, saw family doctor', text: this.translate.instant("INCIDENT.INJURY_DOCTOR") },
                { key: 'Injury, hospital emergency visit', text: this.translate.instant("INCIDENT.INJURY_EMERG") },
                { key: 'Injury, hospitalized', text: this.translate.instant("INCIDENT.INJURY_HOSPITAL") }
            ]
        },
        {
            text: this.translate.instant("INCIDENT.NO"),
            items: [
                { key: 'No injury', text: this.translate.instant("INCIDENT.INJURY_NONE") }
            ]
        }
    ];

    impactChoices = [
        { key: "None", text: this.translate.instant("INCIDENT.NO_IMPACT") },
        { key: "More careful", text: this.translate.instant("INCIDENT.CAREFUL") },
        { key: "Bike less", text: this.translate.instant("INCIDENT.BIKE_LESS") },
        { key: "More careful and bike less", text: this.translate.instant("INCIDENT.CAREFUL_BIKE_LESS") },
        { key: "Stopped biking", text: this.translate.instant("INCIDENT.STOPPED") },
        { key: "Too soon", text: this.translate.instant("INCIDENT.TOO_SOON") }
    ];

    purposeChoices = [
        { key: undefined, text: '---------'},
        { key: "Commute", text: this.translate.instant("INCIDENT.COMMUTE") },
        { key: "Exercise or recreation", text: this.translate.instant("INCIDENT.EXERCISE") },
        { key: "Social reason", text: this.translate.instant("INCIDENT.SOCIAL") },
        { key: "Personal business", text: this.translate.instant("INCIDENT.PERSONAL") },
        { key: "During work", text: this.translate.instant("INCIDENT.WORK") }
    ];

    incidentInvolvementChoices = [
        { key: undefined, text: '---------'}        ,
        { key: "Yes", text: this.translate.instant("INCIDENT.INVOLVED_YES") },
        { key: "No", text: this.translate.instant("INCIDENT.INVOLVED_NO") },
    ]

    conditionChoices = [
        { key: undefined, text: '---------'},
        { key: 'Dry', text: this.translate.instant("INCIDENT.DRY") },
        { key: 'Wet', text: this.translate.instant("INCIDENT.WET") },
        { key: 'Loose sand, gravel, or dirt', text: this.translate.instant("INCIDENT.LOOSE") },
        { key: 'Icy', text: this.translate.instant("INCIDENT.ICY") },
        { key: 'Snowy', text: this.translate.instant("INCIDENT.SNOWY") },
        { key: "Don't remember", text: this.translate.instant("INCIDENT.FORGET") }
    ];

    sightConditionsChoices = [
        { key: undefined, text: '---------'},
        { key: 'No obstructions', text: this.translate.instant("INCIDENT.NO_OBSTRUCTIONS") },
        { key: 'View obstructed', text: this.translate.instant("INCIDENT.VIEW_OBSTRUCTED") },
        { key: 'Glare or reflection', text: this.translate.instant("INCIDENT.GLARE") },
        { key: 'Obstruction on road', text: this.translate.instant("INCIDENT.ROAD_OBSTRUCTION") },
        { key: "Don't Remember", text: this.translate.instant("INCIDENT.FORGET") }
    ];

    carsParkedChoices = [
        { key: undefined, text: '---------' },
        { key: 'Y', text: this.translate.instant("INCIDENT.YES") },
        { key: 'N', text: this.translate.instant("INCIDENT.NO") },
        { key: "I don't know", text: this.translate.instant("INCIDENT.DONT_KNOW") }
    ];

    ridingOnChoices = [
        {
            text: this.translate.instant("INCIDENT.BUSY_STREET"),
            items: [
                { key: undefined, text: '---------' },
                { key: 'Busy street cycle track', text: this.translate.instant("INCIDENT.BUSY_CYCLE_TRACK") },
                { key: 'Busy street bike lane', text: this.translate.instant("INCIDENT.BUSY_BIKE_LANE") },
                { key: 'Busy street, no bike facilities', text: this.translate.instant("INCIDENT.BUSY_NONE") }
            ]
        },
        {
            text: this.translate.instant("INCIDENT.QUIET_STREET"),
            items: [
                { key: 'Quiet street bike lane', text: this.translate.instant("INCIDENT.QUIET_BIKE_LANE") },
                { key: 'Quiet street, no bike facilities', text: this.translate.instant("INCIDENT.QUIET_NONE") }
            ]
        },
        {
            text: this.translate.instant("INCIDENT.NOT_ON_STREET"),
            items: [
                { key: 'Cycle track', text: this.translate.instant("INCIDENT.CYCLE_TRACK") },
                { key: 'Mixed use trail', text: this.translate.instant("INCIDENT.MIXED_USE") },
                { key: 'Sidewalk', text: this.translate.instant("INCIDENT.SIDEWALK") },
            ]
        },
        {
            text: this.translate.instant("INCIDENT.OTHER_TITLE"),
            items: [
                { key: "Don't remember", text: this.translate.instant("INCIDENT.DONT_REMEMBER") }
            ]
        }
    ];

    lightChoices = [
        { key: undefined, text: '---------' },
        { key: "NL", text: this.translate.instant("INCIDENT.NL") },
        { key: "FB", text: this.translate.instant("INCIDENT.FB") },
        { key: "F", text: this.translate.instant("INCIDENT.F") },
        { key: "B", text: this.translate.instant("INCIDENT.B") },
        { key: "Don't remember", text: this.translate.instant("INCIDENT.DONT_REMEMBER") }
    ];

    terrainChoices = [
        { key: undefined, text: '--------' },
        { key: 'Uphill', text: this.translate.instant("INCIDENT.UPHILL") },
        { key: 'Downhill', text: this.translate.instant("INCIDENT.DOWNHILL") },
        { key: 'Flat', text: this.translate.instant("INCIDENT.FLAT") },
        { key: "Don't remember", text: this.translate.instant("INCIDENT.DONT_REMEMBER") }
    ];

    directionChoices = [
        { key: undefined, text: '--------' },
        { key: 'N', text: this.translate.instant("INCIDENT.N") },
        { key: 'NE', text: this.translate.instant("INCIDENT.NE") },
        { key: 'E', text: this.translate.instant("INCIDENT.E") },
        { key: 'SE', text: this.translate.instant("INCIDENT.SE") },
        { key: 'S', text: this.translate.instant("INCIDENT.S") },
        { key: 'SW', text: this.translate.instant("INCIDENT.SW") },
        { key: 'W', text: this.translate.instant("INCIDENT.W") },
        { key: 'NW', text: this.translate.instant("INCIDENT.NW") },
        { key: "I don't know", text: this.translate.instant("INCIDENT.DONT_KNOW") }
    ];

    turningChoices = [
        { key: undefined, text: '--------' },
        { key: 'Heading straight', text: this.translate.instant("INCIDENT.STRAIGHT") },
        { key: 'Turning left', text: this.translate.instant("INCIDENT.LEFT") },
        { key: 'Turning right', text: this.translate.instant("INCIDENT.RIGHT") },
        { key: "I don't remember", text: this.translate.instant("INCIDENT.DONT_REMEMBER") }
    ];

    helmetChoices = [
        { key: undefined, text: '---------' },
        { key: 'Y', text: this.translate.instant("INCIDENT.YES") },
        { key: 'N', text: this.translate.instant("INCIDENT.NO") },
        { key: "I don't know", text: this.translate.instant("INCIDENT.DONT_KNOW") }
    ];

    intoxicatedChoices = [
        { key: undefined, text: '---------' },
        { key: 'Y', text: this.translate.instant("INCIDENT.YES") },
        { key: 'N', text: this.translate.instant("INCIDENT.NO") },
        { key: "I don't know", text: this.translate.instant("INCIDENT.DONT_KNOW") }
    ];

    sourceChoices = [
        { key: undefined, text: '---------' },
        { key: "BikeMaps team", text: this.translate.instant("COMMON_FORM.BM_TEAM") },
        { key: "BikeMaps swag", text: this.translate.instant("COMMON_FORM.BM_SWAG") },
        { key: "Traditional media", text: this.translate.instant("COMMON_FORM.TRAD_MEDIA") },
        { key: "Another website", text: this.translate.instant("COMMON_FORM.OTHER_WEBSITE") },
        { key: "Word of mouth", text: this.translate.instant("COMMON_FORM.WORD_MOUTH") },
        { key: "Social media", text: this.translate.instant("COMMON_FORM.SOCIAL_MEDIA") },
        { key: "Other", text: this.translate.instant("COMMON_FORM.OTHER") },
        { key: "Don't remember", text: this.translate.instant("COMMON_FORM.DONT_REMEMBER") }
    ];

    bicycleTypeChoices = [
        { key: undefined, text: '---------' },
        { key: "Personal", text: this.translate.instant("INCIDENT.BIKE_PERSONAL") },
        { key: "Bike share", text: this.translate.instant("INCIDENT.BIKE_SHARE") },
        { key: "Bike rental", text: this.translate.instant("INCIDENT.BIKE_RENT") }
    ];

    eBikeChoices = [
        { key: undefined, text: '---------' },
        { key: "Yes", text: this.translate.instant("INCIDENT.YES") },
        { key: "No", text: this.translate.instant("INCIDENT.NO") },
        { key: "I don't know", text: this.translate.instant("INCIDENT.DONT_KNOW") }
    ];

    constructor(private translate: TranslateService) {
    }
} 