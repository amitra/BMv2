import { Injectable } from "@angular/core";
import * as moment from "moment";

@Injectable()
export class PopupService {

    constructor() {
    }

    public getPopup(layer): string {
        const feature = layer.feature;
        const type = feature.properties.p_type;
        let popup;
        let date;

        if (type === "collision" || type === "nearmiss") {
            popup = '<strong>Type:</strong> ' + feature.properties.i_type + '<br><strong>';
            if (feature.properties.i_type != "Fall") popup += 'Incident with';
            else popup += 'Due to';
            popup += ':</strong> ' + feature.properties.incident_with + '<br><strong>Date:</strong> ' + moment(feature.properties.date).format("MMM. D, YYYY, h:mma");

            if(feature.properties.details){
                popup += '<br><div class="popup-details"><strong>Details:</strong> ' + feature.properties.details + '</div>';
            }

        } else if (type === "hazard") {
            popup = '<strong>Hazard type:</strong> ' + feature.properties.i_type + '<br><strong>Date:</strong> ' + moment(feature.properties.date).format("MMM. D, YYYY, h:mma");
            if(feature.properties.details){
                popup += '<br><div class="popup-details"><strong>Details:</strong> ' + feature.properties.details + '</div>';
            }

        } else if (type === "theft") {
            popup = '<strong>Theft type:</strong> ' + feature.properties.i_type + '<br><strong>Date:</strong> ' + moment(feature.properties.date).format("MMM. D, YYYY, h:mma");
            if(feature.properties.details){
                popup += '<br><div class="popup-details"><strong>Details:</strong> ' + feature.properties.details + '</div>';
            }
        } else return "error";

        return popup;
    }
}