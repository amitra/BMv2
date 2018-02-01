import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Rx";


@Injectable()
export class DataService {

    constructor(public http: Http) {
    }

    public getIncidentData(incidentType: string, bbox?: string){
        if (bbox) {
            return this.http.get(`https://bikemaps.org/${incidentType}/.json?bbox=${bbox}`).map(res => res.json());
        } else {
            return this.http.get(`https://bikemaps.org/${incidentType}/.json`)
            .map((res: Response) => res.json())
            .catch(this.catchError)
        }
    }

    private catchError(error: Response) {
        return Observable.throw(error.json().error || "Unable to retrieve incident data");
    }
}
