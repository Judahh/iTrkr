import { AppObject, Component, ComponentPageBody, ComponentMap } from 'backappjh';
import { GPS } from './gPS';
import { SVG } from './../sVG/sVG';

export class GPSData extends AppObject {
    private gPS: GPS;
    private size: number;
    private center: number;
    private width: number;
    private height: number;
    private barHeight: number;
    private boxBarHeight: number;
    private boxBarWidth: number;
    private padding: number;
    private svgSky;
    private svgSatelites;
    private satelitesGroup;

    constructor(father?: Component) {
        super(father);
    }

    public run() {
        console.log('GPS!!!');
        let _self = this;
        _self.gPS = GPS.getInstance();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                let markerPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                // console.log('markerPosition:');
                // console.log(markerPosition);

                (<ComponentMap>(<ComponentPageBody>_self.father).arrayAppObject[2].arrayAppObject[0].arrayAppObject[1].arrayAppObject[0]).arrayMarker[0].setPosition(markerPosition);
                (<ComponentMap>(<ComponentPageBody>_self.father).arrayAppObject[2].arrayAppObject[0].arrayAppObject[1].arrayAppObject[0]).map.setCenter(markerPosition);
            }, () => {
            });
        }
        // _self.initDashboard();
        _self.gPS.subscribe((data) => { _self.response(data); });
    }

    public response(data) {
        // console.log('data:', data);
        this.updateDashboard(data.gpsState);
    }


    public updateMap(data) {
        let _self = this;
        if (data.lat != undefined) {
            let markerPosition = {
                lat: data.lat,
                lng: data.lon
            };

            (<ComponentMap>(<ComponentPageBody>_self.father).arrayAppObject[2].arrayAppObject[0].arrayAppObject[1].arrayAppObject[0]).arrayMarker[0].setPosition(markerPosition);
            (<ComponentMap>(<ComponentPageBody>_self.father).arrayAppObject[2].arrayAppObject[0].arrayAppObject[1].arrayAppObject[0]).map.setCenter(markerPosition);
        } else {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    let markerPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    (<ComponentMap>(<ComponentPageBody>_self.father).arrayAppObject[2].arrayAppObject[0].arrayAppObject[1].arrayAppObject[0]).arrayMarker[0].setPosition(markerPosition);
                    (<ComponentMap>(<ComponentPageBody>_self.father).arrayAppObject[2].arrayAppObject[0].arrayAppObject[1].arrayAppObject[0]).map.setCenter(markerPosition);
                }, () => {
                });
            }
        }
    }

    public updateDashboard(data) {
        if (this.father !== undefined) {
            try {
                this.updateMap(data);
            } catch (error) {
                // this.initDashboard();
                // console.error(error);
            }
        }
    }

    public elevationToRadius(elevation, size) {
        // Degrees:
        // 0° has radius of 120
        // 90° has radius of 0
        return size * (1 - elevation / 90);
    }
}