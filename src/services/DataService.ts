import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Rx";


@Injectable()
export class DataService {

    constructor(public http: Http) {
    }

    public getIncidentData(incidentType: string, bbox?: string) : any {
        if (bbox) {
            return this.http.get(`https://bikemaps.org/${incidentType}/.json?bbox=${bbox}`).map(res => res.json());
        } else {
            return this.http.get(`https://bikemaps.org/${incidentType}/.json`)
            .map((res: Response) => res.json())
            .catch(this.catchError)
        }
    }

    public submitIncidentData(incidentType: string, data: any) : any {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");

        const options = new RequestOptions({ headers: headers });

        return this.http.post(`https://bikemaps.org/${incidentType}`, data, options);
    }

    private catchError(error: Response) {
        return Observable.throw(error.json().error || "Unable to retrieve incident data");
    }
}
