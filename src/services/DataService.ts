import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

    constructor(public http: HttpClient) {
    }

    public getIncidentData(incidentType: string, bbox?: string) : any {
        if (bbox) {
            return this.http.get(`https://bikemaps.org/${incidentType}/.json?bbox=${bbox}`);
        } else {
            return this.http.get(`https://bikemaps.org/${incidentType}/.json`)
            .catch((err) => err);
        }
    }

    public submitIncidentData(incidentType: string, data: any) : any {
        const headers = new HttpHeaders()
        .set("Accept", "application/json")
        .set("Content-Type", "application/json");

        return this.http.post(`https://bikemaps.org/${incidentType}`, data, { headers });
    }
}
