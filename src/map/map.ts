import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ActionSheetController, MenuController, NavController, Platform, PopoverController } from "ionic-angular";
import { PopoverPage } from "../pages/popover/popover";
import { HazardPage } from "../pages/hazard/hazard";
import { TheftPage } from "../pages/theft/theft";
import { CollisionPage } from "../pages/collision/collision";
import { NearmissPage } from "../pages/nearmiss/nearmiss";
import { IconService } from "../services/IconService";
import { DataService } from "../services/DataService";
import { PopupService } from "../services/PopupService";
import { CoordService } from "../services/CoordService";
import { AuthService } from "../services/AuthService";
import { AlertAreaService } from "../services/AlertAreaService";
import { Events } from "ionic-angular";
import { Storage } from '@ionic/storage';

import * as L from "leaflet";
import "leaflet.markerCluster";
import esri from "esri-leaflet";
import "leaflet-easybutton";
import "leaflet-draw";

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
    infrastructureLayer;

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

    // Object for managing layer visibliity
    legend: any = {
        showIncidentData: true,
        showCollisions: true,
        showNearmiss: true,
        showHazards: true,
        showThefts: true,
        showStravaHM: true,
        showAlertAreas: true,
        showInfrastructure: false
    };

    // Variables for Leaflet Draw controls
    leafletDrawOptions;
    drawControl;

    mapCenter;
    zoom;

    constructor(public actionSheetController: ActionSheetController, private alertAreaService: AlertAreaService, private authService: AuthService, private events: Events, public menuCtrl: MenuController, public navCtrl: NavController, public popoverCtrl: PopoverController, public platform: Platform, private vibration: Vibration, public iconService: IconService, public dataService: DataService, public popupService: PopupService, private storage: Storage, public translateService: TranslateService, private coordService: CoordService) {
    }
    
    ngOnInit():void {
        this.storage.get("lastCoords").then((val) => {
            if (val && val.lat && val.lng && val.zoom) {
                this.mapCenter = new L.LatLng(val.lat, val.lng);
                this.zoom = val.zoom;
            } else {
                this.mapCenter = new L.LatLng(54.1, -124.7);
                this.zoom = 4;
            }
            this.initializeMap(this.menuCtrl);
        });
    }

    initializeMap = (menuCtrl: MenuController):void => {
        this.map = new L.Map("map", {
            center: this.mapCenter,
            zoom: this.zoom,
            zoomControl: false
        });

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
        this.events.subscribe("authService:initialized", this.handleLogin);
        this.events.subscribe("pointAdded", this.handlePointAdded);

        // Add the drawing control to the map if the user is logged in
        if (this.authService.isAuthenticated) {
            this.map.addControl(this.drawControl);
        }
    }

    handlePointAdded = () => {
        this.updateIncidents(true);
    }

  // Add all layers to the map
  addLayers():void {
        const _me = this;

        // Add an Esri base map
        this.esriBM = esri.basemapLayer("Streets").addTo(this.map);

        // Add Strava data
        this.stravaHM = L.tileLayer('https://heatmap-external-{s}.strava.com/tiles/ride/gray/{z}/{x}/{y}.png', {
          minZoom: 3,
          maxZoom: 12,
          opacity: 0.8,
          attribution: '<a href=http://labs.strava.com/heatmap/>http://labs.strava.com/heatmap/</a>'
        }).addTo(this.map);

        // Add OSM bike infrastructure hosted at BikeMaps.org
        this.infrastructureLayer = L.tileLayer.wms("https://bikemaps.org/WMS", {
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
            return _me.pieChart(cluster);
        }
        });

        this.map.addLayer(this.incidentData);

        // Alert areas
        this.alertAreaLayer = new L.FeatureGroup();
        this.getAlertareas();
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
                icon: '<img alt="legend" src="assets/icon/layers.png" style="margin-top: 4px">',
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

        // Leaflet-Draw
        this.leafletDrawOptions =  {
            draw: {
                polyline: false,
                polygon: {
                    allowIntersection: false,
                    drawError:  {
                        color: "#e1e100",
                        message: "Oh snap! You can't draw that!"
                    },
                },
                circle: false,
                rectangle: false,
                marker: false,
                circlemarker: false
            },
            edit: {
                featureGroup: this.alertAreaLayer,
                edit: false,
                remove: true
            }
        }

        this.drawControl = new L.Control.Draw(this.leafletDrawOptions);
    }


    getAlertareas = () => {
        if (this.authService.isAuthenticated) {
           this.removeAlertAreas();
           const alertAreas = this.alertAreaService.getAlertAreas(this.authService.currentUser.token).subscribe(data => {
                this.geofenceLayer = L.geoJSON(data, {
                    style: (feature) => {
                        return {
                            color: "#3b9972",
                            weight: 2,
                            opacity: 0.6,
                            fillOpacity: 0.1,
                            pk: feature.properties.pk,
                            /*Mark the polygon with it's database id*/
                            objType: 'polygon'
                        }
                    }
                }).eachLayer((layer) => {
                    this.alertAreaLayer.addLayer(layer);
                });
            }, err => {
                if (err.error) {
                    try {
                        console.log(err.error);
                    } catch (err) {
                        // Do nothing
                    }
                }
                 
            });
            if (this.legend.showAlertAreas) {
                this.map.addLayer(this.alertAreaLayer);
            }
        }
    }

    removeAlertAreas = () => {
        if (this.alertAreaLayer) {
            this.map.removeLayer(this.alertAreaLayer);
            this.alertAreaLayer.clearLayers();
            this.map.addLayer(this.alertAreaLayer);
        }
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

    // Setup handlers for Leaflet Draw
    this.map.on(L.Draw.Event.CREATED, this.handleDrawCreated);
    this.map.on(L.Draw.Event.DELETED, this.handleDrawDelete);
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

    var pie = d3.pie<CountData>()
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
    .attr("d", <any>path)
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
      html: new XMLSerializer().serializeToString(tag),
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

        var coords = this.map.getCenter();
        var zoom = this.map.getZoom();
        this.storage.set("lastCoords", { lat: coords.lat, lng: coords.lng, zoom: zoom });
    }

    updateCollisionsOnMap(data: any) {
        if (data) {
            const _this_ = this;
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
                        icon: _this_.collisionIcon
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
            const _this_ = this;
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
                        icon: _this_.nearmissIcon
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
            const _this_ = this;
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
                        icon: _this_.hazardIcon
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
            const _this_ = this;
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
                        icon: _this_.theftIcon
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
                    handler: () => {
                        this.cancelReport();
                        this.navCtrl.push(CollisionPage);
                    }
                },
                { 
                    text: this.translateService.instant("ACTIONSHEET.NEARMISS"),
                    handler: () => {
                        this.cancelReport();
                        this.navCtrl.push(NearmissPage);
                    }
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
                    handler: () => {
                        this.cancelReport();
                        this.navCtrl.push(TheftPage);
                    }
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
        if (this.authService.isAuthenticated) {
            try {
                this.map.removeControl(this.drawControl);    
            } catch (err) {
                // Do nothing
            } finally {
                this.map.addControl(this.drawControl);
                this.getAlertareas();
                this.legend.showAlertAreas = true;
            }
        }
    }

    handleLogout = () => {
        this.map.removeControl(this.drawControl);
        this.removeAlertAreas();
        this.legend.showAlertAreas = false;
    }

    handleDrawCreated = (e) => {
        var layer = e.layer;
        if (e.layerType === "polygon") {
            var feature = e.layer.toGeoJSON();
            this.alertAreaService.submitAlertArea(feature, this.authService.currentUser.token).subscribe(data => {
                try {
                    this.getAlertareas();
                    console.log("Alert area successfully created.");
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log("An error occurred while creating the alert area: " + err);
            });
        }
    }

    handleDrawDelete = (obj) => {
        let deleteError = false;
        if (obj && obj.layers) {
            obj.layers.eachLayer((layer) => {
                if (layer.options && layer.options.pk) {
                    this.alertAreaService.deleteAlertArea(layer.options.pk, this.authService.currentUser.token).subscribe(data => {
                    }, err => {
                        deleteError = true;
                    });
                }
            });
        }

        if (!deleteError) {
            console.log("Alert areas successfully deleted.");
        }
        else {
            console.log("An error occurred while deleting the alert area(s).");
        }
    }

    // Methods for managing visibility of layers on the map

    toggleCollisionLayer = () => {
        if (this.collisionLayer) {
            if (this.legend.showCollisions) {
                this.incidentData.removeLayer(this.collisionLayer);
                this.incidentData.addLayer(this.collisionLayer);
            } else {
                this.incidentData.removeLayer(this.collisionLayer);
            }
        }
    }

    toggleNearmissLayer = () => {
        if (this.nearmissLayer) {
            if (this.legend.showNearmiss) {
                this.incidentData.removeLayer(this.nearmissLayer);
                this.incidentData.addLayer(this.nearmissLayer);
            } else {
                this.incidentData.removeLayer(this.nearmissLayer);
            }
        }
    }

    toggleHazardLayer = () => {
        if (this.hazardLayer) {
            if (this.legend.showHazards) {
                this.incidentData.removeLayer(this.hazardLayer);
                this.incidentData.addLayer(this.hazardLayer);
            } else {
                this.incidentData.removeLayer(this.hazardLayer);
            }
        }
    }

    toggleTheftLayer = () => {
        if (this.theftLayer) {
            if (this.legend.showThefts) {
                this.incidentData.removeLayer(this.theftLayer);
                this.incidentData.addLayer(this.theftLayer);
            } else {
                this.incidentData.removeLayer(this.theftLayer);
            }
        }
    }

    toggleStravaHM = () => {
        if (this.stravaHM) {
            if (this.legend.showStravaHM) {
                this.map.removeLayer(this.stravaHM);
                this.map.addLayer(this.stravaHM);
            } else {
                this.map.removeLayer(this.stravaHM);
            }
        }
    }

    toggleAlertAreas = () => {
        if (this.alertAreaLayer) {
            if (this.legend.showAlertAreas) {
                this.map.removeLayer(this.alertAreaLayer);
                this.map.addLayer(this.alertAreaLayer);
            } else {
                this.map.removeLayer(this.alertAreaLayer);
            }
        }
    }


    toggleInfrastructure = () => {
        if (this.infrastructureLayer) {
            if (this.legend.showInfrastructure) {
                this.map.removeLayer(this.infrastructureLayer);
                this.map.addLayer(this.infrastructureLayer);
            } else {
                this.map.removeLayer(this.infrastructureLayer);
            }
        }
    }
}

class CountData {
    color: number;
    count: any;
}