import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ActionSheetController, MenuController, NavController, Platform, PopoverController } from "ionic-angular";
import { PopoverPage } from "../pages/popover/popover";
import { HazardPage } from "../pages/hazard/hazard";
import { IconService } from "../services/IconService";
import { DataService } from "../services/DataService";
import { PopupService } from "../services/PopupService";
import { CoordService } from "../services/CoordService";
import { Events } from "ionic-angular";

import * as L from "leaflet";
import "leaflet.markerCluster";
import esri from "esri-leaflet";
import "leaflet-easybutton";

import { Vibration } from "@ionic-native/vibration";
import * as d3 from "d3";
import * as _ from "underscore";

@Component({
    selector: 'page-map',
    templateUrl: 'map.html'
})


export class MapPage implements OnInit {

    // A variable for the leaflet map
    map;

    // Flag for hiding/showing target icon
    showTargetMarker = false;

    // Esri basemap
    esriBM;

    // Strava heatmap
    stravaHM;

    // Bike infrastructure from our WMS server
    infrastructure;

    // Feature group layer for alert areas
    alertAreaLayer

    // Combined incident data for display as a styled MarkerClusterGroup
    incidentData;

    // Point data
    collisions;
    nearmiss;
    hazards;
    thefts;
    official;

    // Incident layers
    collisionLayer;
    nearmissLayer;
    hazardLayer;
    theftLayer;
    officialLayer;
    geofenceLayer;


    // Icons for the layers
    collisionIcon;
    nearmissIcon;
    hazardIcon;
    theftIcon;
    officialIcon;

    // Variable for map extent calculations
    extendedBounds;
    newMapBounds;

    // An object for syncing state of legend and state of markers on the map
    legend;

    // Strings that need translation in Javascript
    trans = {
        
    };

    constructor(public actionSheetController: ActionSheetController, private events: Events, public menuCtrl: MenuController, public navCtrl: NavController, public popoverCtrl: PopoverController, public platform: Platform, private vibration: Vibration, public iconService: IconService, public dataService: DataService, public popupService: PopupService, public translateService: TranslateService, private coordService: CoordService) {
    }
    

    ngOnInit():void {
        this.initializeMap(this.menuCtrl);
    }

    initializeMap(menuCtrl: MenuController):void {
        this.map = new L.Map("map", {
            center: new L.LatLng(40.731253, -73.996139),
            zoom: 12,
            zoomControl: false
        });

        this.legend = {
            showIncidentData: true,
            showCollisions: true,
            showNearmiss: true,
            showHazards: true,
            showThefts: true,
            showOfficial: false,
            showStravaHM: true,
            showAlertAreas: false,
            showInfrastructure: false
        };

        // Get icons/markers for the map
        this.collisionIcon = this.iconService.getIcon("collision");
        this.nearmissIcon = this.iconService.getIcon("nearmiss");
        this.hazardIcon = this.iconService.getIcon("hazard");
        this.theftIcon = this.iconService.getIcon("theft");

        this.addLayers();
        this.addButtons(menuCtrl);
        this.setupEventHandlers();
        this.platform.ready().then(() => {
            this.geolocate();
        });

        this.extendedBounds = this.getExtendedBounds(this.map.getBounds());
        this.getIncidents(this.extendedBounds);

        // Subscribe to events
        this.events.subscribe("authService:login", this.handleLogin);
        this.events.subscribe("authService:logout", this.handleLogout);
    }

  // Add all layers to the map
  addLayers():void {
    const _this = this;
    // Add an Esri base map
    this.esriBM = esri.basemapLayer("Streets").addTo(this.map);

    // Add Strava data
    // this.stravaHM = L.tileLayer('https://heatmap-external-{s}.strava.com/tiles/ride/gray/{z}/{x}/{y}.png', {
    //   minZoom: 3,
    //   maxZoom: 16,
    //   opacity: 0.8,
    //   attribution: '<a href=http://labs.strava.com/heatmap/>http://labs.strava.com/heatmap/</a>'
    // }).addTo(this.map);


    // Add OSM bike infrastructure hosted at BikeMaps.org
    this.infrastructure = L.tileLayer.wms("https://bikemaps.org/WMS", {
      layers: 'bikemaps_infrastructure',
      format: 'image/png',
      transparent: true,
      version: '1.3.0'
    });

    // Marker cluster layer for clustering incident data
    this.incidentData = L.markerClusterGroup({
      maxClusterRadius: 70,
      polygonOptions: {
        color: '#2c3e50',
        weight: 3
      },
      iconCreateFunction: function (cluster) {
        // var data = _this.serializeClusterData(cluster);
        return _this.pieChart(cluster);
      }
    });

    this.map.addLayer(this.incidentData);

    // Instantiate a layer for alert areas, but don't add data yet or add it to the map
    this.alertAreaLayer = L.featureGroup([]);
  }

  
    // Add buttons to the map
    addButtons(menuCtrl: MenuController):void {
        const __this = this;

        // Add the legend toggle button
        L.easyButton({
            id: "legend-toggle",
            position: "topright",
            leafletClasses: true,
            states: [{
                stateName: "toggle-legend",
                onClick: function () {
                    menuCtrl.open();
                },
                icon: "fa-truck",
                title: "legend-toggle"
            }]
        }).addTo(this.map);

        // Add the geolocate button
        L.easyButton({
            id: "geolocate_bttn",
            position: "topleft",
            leafletClasses: true,
            states: [{
                stateName: "geolocate",
                onClick: function (btn, map) {
                    map.locate({
                    setView: true,
                    watch: false,
                    maxZoom: 15,
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300,
                    })
                    .on('locationfound', function (location) {
                        /*          extendedBounds = getExtendedBounds($scope.map.getBounds());
                        $ionicLoading.hide(); */
                    })
                    .on('locationerror', function (e) {
                        console.log(e);
                        // $ionicLoading.hide();
                        // navigator.notification.alert("We could not find your current location. Please enable location services.", null,"Location access denied");
                    }
                    )
                },
                icon: "fa fa-crosshairs",
                title: "geolocate"
            }]
        }).addTo(this.map);

        // Add the report button
        L.easyButton({
            id: "report",
            position: "topleft",
            leafletClasses: true,
            states: [{
                stateName: "report",
                onClick: function () {
                    __this.addReport();
                },
                icon: "fa-map-marker",
                title: "report"
            }]
        }).addTo(this.map);
    }

  // Setup the various event handlers
  setupEventHandlers() {
      const _that = this;
      this.map.on("moveend", () => this.updateIncidents(false));

    // Add popup when clicking on a single marker
    this.incidentData.on("click", function(e) {
        const layer = e.layer;
        const popupContent = _that.popupService.getPopup(e.layer);
        layer.bindPopup(popupContent, { closeOnClick: true }).openPopup();
    });
    
  }

  // Geolocation
  geolocate(): void {
      /*        $ionicLoading.show({
       template: '<ion-spinner></ion-spinner>',
       });*/
      this.map.locate({
          setView: true,
          watch: false,
          maxZoom: 15,
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300,
      })
          .on('locationfound', function (location) {
            /*          extendedBounds = getExtendedBounds($scope.map.getBounds());
             $ionicLoading.hide(); */
          })
          .on('locationerror', function (e) {
            console.log(e);
            // $ionicLoading.hide();
            // navigator.notification.alert("We could not find your current location. Please enable location services.", null,"Location access denied");
          }
      )
  }



// pieChart
// Purpose: Builds svg cluster DivIcons
// inputs: clusters passed from Leaflet.markercluster
// output: L.DivIcon donut chart where the number of points in a cluster are represented by a proportional donut chart arc of the same color as the underlying marker
pieChart(cluster) {
    var children = cluster.getAllChildMarkers();
  
    // Count the number of points of each kind in the cluster using underscore.js
    var data = _.chain(children)
      .countBy(function(i){ return i.options.icon.options.color })
      .map(function(count, color){ return {"color": color, "count": count} })
      .sortBy(function(i){ return -i.count })
      .value();
  
    var total = children.length;
  
    const outerR = (total >= 10 ? (total < 50 ? 20 : 25) : 15);
    const innerR = (total >= 10 ? (total < 50 ? 10 : 13) : 7);
  

    // Define the svg layer
    var width = 50,
    height = 50;
    var tag = document.createElementNS(d3.namespaces.svg, "svg");
    var svg = d3.select(tag);
    var g = svg.append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var pie = d3.pie()
        .sort(null)
        .value(function(d) {
            return d.count;
    });

    var path = d3.arc()
        .outerRadius(outerR)
        .innerRadius(innerR);

    var arc = g.selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");
    
    arc.append("path")
    .attr("d", path)
    .attr("fill", (d) => d.data.color);
  
    // Add center fill
    g.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", innerR)
    .attr('class', 'center')
    .attr("fill", "#f1f1f1");
  
    // Add count text
    g.append('text')
    .attr('class', 'pieLabel')
    .attr('text-anchor', 'middle')
    .attr('dy', '.3em')
    .text(total)
  
    return new L.DivIcon({
      html: (new window.XMLSerializer()).serializeToString(tag),
      className: 'marker-cluster',
      iconSize: new L.Point(40, 40)
    });
  };

    // Update incidents data on map
    updateIncidents(force) {
        this.newMapBounds = this.map.getBounds();

        if(force){
            this.extendedBounds = this.getExtendedBounds(this.newMapBounds);
            this.getIncidents(this.extendedBounds);
        } else if(!this.newBoundsWithinExtended(this.newMapBounds, this.extendedBounds)){
                this.extendedBounds = this.getExtendedBounds(this.newMapBounds);
                this.getIncidents(this.extendedBounds);
        }
    }

    updateCollisionsOnMap(data: any) {
        if (data) {
            const _this = this;
            this.collisions = data;

            if ( this.legend.showIncidentData && this.legend.showCollisions) {
                try {
                    this.incidentData.removeLayer(this.collisionLayer);
                } catch (e) {
                    // Nothing to do...tried to remove a layer that doesn't exist
                }
            }

            this.collisionLayer = L.geoJSON(this.collisions.features, {
                pointToLayer: function(feature, latlng) {
                    return L.marker(latlng, {
                        icon: _this.collisionIcon
                        // ftype: "collision",
                        // objType: feature.properties.model
                    })
                }
            });

            if (this.legend.showIncidentData && this.legend.showCollisions) {
                this.incidentData.addLayer(this.collisionLayer);
            }
        }
    }

    updateNearmissOnMap(data: any) {
        if (data) {
            const _this = this;
            this.nearmiss = data;

            if ( this.legend.showIncidentData && this.legend.showNearmiss) {
                try {
                    this.incidentData.removeLayer(this.nearmissLayer);
                } catch (e) {
                    // Nothing to do...tried to remove a layer that doesn't exist
                }
            }

            this.nearmissLayer = L.geoJSON(this.nearmiss.features, {
                pointToLayer: function(feature, latlng) {
                    return L.marker(latlng, {
                        icon: _this.nearmissIcon
                        // ftype: "collision",
                        // objType: feature.properties.model
                    })
                }
            });

            if (this.legend.showIncidentData && this.legend.showNearmiss) {
                this.incidentData.addLayer(this.nearmissLayer);
            }
        }
    }

    updateHazardsOnMap(data: any) {
        if (data) {
            const _this = this;
            this.hazards = data;

            if ( this.legend.showIncidentData && this.legend.showHazards) {
                try {
                    this.incidentData.removeLayer(this.hazardLayer);
                } catch (e) {
                    // Nothing to do...tried to remove a layer that doesn't exist
                }
            }

            this.hazardLayer = L.geoJSON(this.hazards.features, {
                pointToLayer: function(feature, latlng) {
                    return L.marker(latlng, {
                        icon: _this.hazardIcon
                        // ftype: "collision",
                        // objType: feature.properties.model
                    })
                }
            });

            if (this.legend.showIncidentData && this.legend.showHazards) {
                this.incidentData.addLayer(this.hazardLayer);
            }
        }
    }

    updateTheftsOnMap(data: any) {
        if (data) {
            const _this = this;
            this.thefts = data;

            if ( this.legend.showIncidentData && this.legend.showThefts) {
                try {
                    this.incidentData.removeLayer(this.theftLayer);
                } catch (e) {
                    // Nothing to do...tried to remove a layer that doesn't exist
                }
            }

            this.theftLayer = L.geoJSON(this.thefts.features, {
                pointToLayer: function(feature, latlng) {
                    return L.marker(latlng, {
                        icon: _this.theftIcon
                        // ftype: "collision",
                        // objType: feature.properties.model
                    })
                }
            });

            if (this.legend.showIncidentData && this.legend.showThefts) {
                this.incidentData.addLayer(this.theftLayer);
            }
        }
    }


    // Get data from the Bike Maps API and add to Marker Cluster Layer
    getIncidents(bnds){
        // Get collision data from BikeMaps api and add to map if visible in the legend
        this.dataService.getIncidentData("collisions", bnds.toBBoxString()).subscribe(data => this.updateCollisionsOnMap(this.collisions = data));
        this.dataService.getIncidentData("nearmiss", bnds.toBBoxString()).subscribe(data => this.updateNearmissOnMap(this.nearmiss = data));
        this.dataService.getIncidentData("hazards", bnds.toBBoxString()).subscribe(data => this.updateHazardsOnMap(this.hazards = data));
        this.dataService.getIncidentData("thefts", bnds.toBBoxString()).subscribe(data => this.updateTheftsOnMap(this.thefts = data));


        // this.collisions = Collision_Service.get({bbox: bnds.toBBoxString()});
        // collisions.$promise.then(function () {
        //     unfiltered_collisions = collisions;
        //     if($scope.legend.filter) {
        //         filterPoints();
        //     }
        //     if($scope.legend.incidentData && $scope.legend.collision) {
        //         try {
        //             incidentData.removeLayer(collisionLayer);
        //         }
        //         catch(err) {
        //             // Nothing to do...tried to remove a layer that doesn't exist
        //         }
        //     }
        //     collisionLayer = L.geoJson(collisions.features, {
        //         pointToLayer: function (feature, latlng) {
        //             return L.marker(latlng, {icon: collisionIcon,
        //                                     ftype: 'collision',
        //                                     objType: feature.properties.model})
        //         }
        //     });
        //     if($scope.legend.incidentData && $scope.legend.collision) {
        //         incidentData.addLayer(collisionLayer);
        //     }
        // }, function(err) {
        // });

        // // Get nearmiss data from BikeMaps api and add to map
        // nearmiss = Nearmiss_Service.get({bbox: bnds.toBBoxString()});
        // nearmiss.$promise.then(function () {
        //     unfiltered_nearmiss = nearmiss;
        //     if($scope.legend.filter) {
        //         filterPoints();
        //     }
        //     if($scope.legend.incidentData && $scope.legend.nearmiss) {
        //         try {
        //             incidentData.removeLayer(nearmissLayer);
        //         }
        //         catch(err) {
        //             // Nothing to do...tried to remove a layer that doesn't exist
        //         }
        //     }
        //     nearmissLayer = L.geoJson(nearmiss.features, {
        //         pointToLayer: function (feature, latlng) {
        //             return L.marker(latlng, {icon: nearmissIcon,
        //                                     ftype: 'nearmiss',
        //                                     objType: feature.properties.model
        //             })
        //         }
        //     });
        //     if($scope.legend.incidentData && $scope.legend.nearmiss) {
        //         incidentData.addLayer(nearmissLayer);
        //     }
        // }, function(err) {
        // });

        // // Get hazard data from BikeMaps api and add to map
        // hazards = Hazard_Service.get({bbox: bnds.toBBoxString()});
        // hazards.$promise.then(function () {
        //     unfiltered_hazards = hazards;
        //     if($scope.legend.filter) {
        //         filterPoints();
        //     }
        //     if($scope.legend.incidentData && $scope.legend.hazard) {
        //         try {
        //             incidentData.removeLayer(hazardLayer);
        //         }
        //         catch(err) {
        //             // Nothing to do...tried to remove a layer that doesn't exist
        //         }
        //     }
        //     hazardLayer = L.geoJson(hazards.features, {
        //         pointToLayer: function (feature, latlng) {
        //             return L.marker(latlng, {icon: hazardIcon,
        //                                     ftype: 'hazard',
        //                                     objType: feature.properties.model})
        //         }
        //     });
        //     if($scope.legend.incidentData && $scope.legend.hazard) {
        //         incidentData.addLayer(hazardLayer);
        //     }
        // }, function(err) {
        // });

        // // Get theft data from BikeMaps api and add to map
        // thefts = Theft_Service.get({bbox: bnds.toBBoxString()});
        // thefts.$promise.then(function () {
        //     unfiltered_thefts = thefts;
        //     if($scope.legend.filter) {
        //         filterPoints();
        //     }
        //     if($scope.legend.incidentData && $scope.legend.theft) {
        //         try {
        //             incidentData.removeLayer(theftLayer);
        //         }
        //         catch(err) {
        //             // Nothing to do...tried to remove a layer that doesn't exist
        //         }
        //     }
        //     theftLayer = L.geoJson(thefts.features, {
        //         pointToLayer: function (feature, latlng) {
        //             return L.marker(latlng, {icon: theftIcon,
        //                                     ftype: 'theft',
        //                                     objType: feature.properties.model})
        //         }
        //     });
        //     if($scope.legend.incidentData && $scope.legend.theft) {
        //         incidentData.addLayer(theftLayer);
        //     }
        // }, function(err) {
        // });

        // // Get official data from BikeMaps api and add to map
        // official = Official_Service.get({bbox: bnds.toBBoxString()});
        // official.$promise.then(function () {
        //     unfiltered_official = official;
        //     if($scope.legend.filter) {
        //         filterPoints();
        //     }
        //     if($scope.legend.incidentData && $scope.legend.official) {
        //         try {
        //             incidentData.removeLayer(officialLayer);
        //         }
        //         catch(err) {
        //             // Nothing to do...tried to remove a layer that doesn't exist
        //         }
        //     }
        //     officialLayer = L.geoJson(official.features, {
        //         pointToLayer: function (feature, latlng) {
        //             return L.marker(latlng, {icon: officialIcon,
        //                 ftype: 'official',
        //                 objType: feature.properties.model})
        //         }
        //     });
        //     if($scope.legend.incidentData && $scope.legend.official) {
        //         incidentData.addLayer(officialLayer);
        //     }
        // }, function(err) {
        // });
    }
    

    // Arbitrarily increase size of bounding box
    getExtendedBounds(bnds){
        // get the coordinates for the sake of readability
        var swlat = bnds._southWest.lat;
        var swlng = bnds._southWest.lng;
        var nelat = bnds._northEast.lat;
        var nelng = bnds._northEast.lng;

        // Increase size of bounding box in each direction by 50%
        swlat = swlat - Math.abs(0.5*(swlat - nelat)) > -90 ? swlat - Math.abs(0.5*(swlat - nelat)) : -90;
        swlng = swlng - Math.abs(0.5*(swlng - nelng)) > -180 ? swlng - Math.abs(0.5*(swlng - nelng)) : -180;
        nelat = nelat + Math.abs(0.5*(swlat - nelat)) < 90 ? nelat + Math.abs(0.5*(swlat - nelat)) : 90;
        nelng = nelng + Math.abs(0.5*(swlng - nelng)) < 180 ? nelng + Math.abs(0.5*(swlng - nelng)) : 180;

        return L.latLngBounds(L.latLng(swlat, swlng), L.latLng(nelat, nelng));
    }

    // Determine if the new bounding box is with in the old bounding box
    // Return true if new BBox is contained within the old BBox
    newBoundsWithinExtended(newMapBnds, extendedBnds) {
        if (newMapBnds._southWest.lat < extendedBnds._southWest.lat ||
            newMapBnds._southWest.lng < extendedBnds._southWest.lng ||
            newMapBnds._northEast.lat > extendedBnds._northEast.lat ||
            newMapBnds._northEast.lng > extendedBnds._northEast.lng) {
            return false;
        }
        else {
            return true;
        }
    }

    closeMenu() {
        this.menuCtrl.close();
    }

    presentPopover = ($event) => {
        const popover = this.popoverCtrl.create(PopoverPage);
        popover.present({
            ev: $event
        });
    }

    
    // Temporarily hide incident data and show map reporting UI
    addReport = () => {
        if (this.showTargetMarker === false) {

            this.map.removeLayer(this.incidentData);
            this.showTargetMarker = true;
            this.vibration.vibrate(100);
        } else {
            this.cancelReport();
        }
    };

    // Restore incident data and hide map reporting UI
    cancelReport = () => {
        this.showTargetMarker = false;
        this.map.addLayer(this.incidentData);
    }

    // Show the report options on an ActionSheet
    showReportOptions() {
        const mapCenter = this.map.getCenter();
        this.coordService.coordinates[0] = mapCenter.lng;
        this.coordService.coordinates[1] = mapCenter.lat;

        const actionSheet = this.actionSheetController.create({
            title: this.translateService.instant("ACTIONSHEET.TITLE"),
            buttons: [
                { 
                    text: this.translateService.instant("ACTIONSHEET.COLLISION"),
                },
                { 
                    text: this.translateService.instant("ACTIONSHEET.NEARMISS"),
                },
                {
                    text: this.translateService.instant("ACTIONSHEET.HAZARD"),
                    handler: () => {
                        this.cancelReport();
                        this.navCtrl.push(HazardPage);
                    }
                },
                {
                    text: this.translateService.instant("ACTIONSHEET.THEFT"),
                },
                { 
                    text: this.translateService.instant("ACTIONSHEET.CANCEL"),
                    role: "cancel",
                    handler: () => { this.cancelReport() }
                }
            ]
        });


        actionSheet.present();
    }

    handleLogin = () => {
        console.log("Login event happened");
    }

    handleLogout = () => {
        console.log("Logout event happened");
    }
}
