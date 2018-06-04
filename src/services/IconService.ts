import { Injectable } from '@angular/core';
import * as L from "leaflet";
import "leaflet.awesome-markers/dist/leaflet.awesome-markers";


@Injectable()
export class IconService {

    // Icon color definitions
    iconColors = {
        "collision": "#d63e2a",
        "nearmiss": "#f3952f",
        "hazard": "#72b026",
        "theft": "#575757",
        "official": "#436978",
        "undefined": "#999999",
        "geocode": "#a23336",
        "location": "#a23336"
    };

    icons;

    colIcon = L.AwesomeMarkers.icon({
        icon: "fa-bicycle",
        markerColor: 'red',
        iconColor: 'black',
    });

    nearIcon = new L.AwesomeMarkers.Icon({
        icon: "fa-bicycle",
        markerColor: 'red',
        iconColor: 'black',
    });

    iconSmall = L.divIcon({
        className: "leaflet-usermarker-small",
        iconSize: [17, 17],
        iconAnchor: [9, 9],
        popupAnchor: [0, -10],
        labelAnchor: [3, -4],
        html: ''
    });

    circleStyle = {
        stroke: true,
        color: "#03f",
        weight: 3,
        opacity: 0.5,
        fillOpacity: 0.15,
        fillColor: "#03f",
        clickable: false
    };

    constructor() {
        L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';

        this.icons = {
            "collisionIcon": L.AwesomeMarkers.icon({
                icon: "fa-bicycle",
                markerColor: 'red',
                iconColor: 'black',
            }),
            "nearmissIcon": L.AwesomeMarkers.icon({
                icon: "fa-bicycle",
                markerColor: 'orange',
                iconColor: 'black',
            }),
            "bikeGreyIcon": L.AwesomeMarkers.icon({
                icon: "fa-bicycle",
                markerColor: 'lightblue',
                iconColor: 'black',
            }),
            "hazardIcon": L.AwesomeMarkers.icon({
                icon: "fa-warning",
                markerColor: 'green',
                iconColor: 'black',
            }),
            "theftIcon": L.AwesomeMarkers.icon({
                icon: "fa-bicycle",
                markerColor: 'gray',
                iconColor: '#cbcbcb',
            }),
            "geocodeIcon": L.AwesomeMarkers.icon({
                icon: "fa-flag",
                markerColor: 'darkred',
                iconColor: 'black',
            }),
            "locationIcon": L.AwesomeMarkers.icon({
                icon: "fa-user",
                markerColor: 'darkred',
                iconColor: 'black',
            })
        };

        this.icons.collisionIcon.options.color = this.getColor("collision");
        this.icons.nearmissIcon.options.color = this.getColor("nearmiss");
        this.icons.hazardIcon.options.color = this.getColor("hazard");
        this.icons.theftIcon.options.color = this.getColor("theft");
    }

    public getIcon(type: string){
        if (type === "collision")
            return this.icons["collisionIcon"];
        else if (type === "nearmiss")
            return this.icons["nearmissIcon"];
        else if (type === "hazard")
            return this.icons["hazardIcon"];
        else if (type === "theft")
            return this.icons["theftIcon"];
        else return;
    }

      // Given type, return the icon color as defined in iconColors
      getColor(type) {
          return this.iconColors[type];
      }
};
