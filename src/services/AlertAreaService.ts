import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Rx";


@Injectable()
export class AlertAreaService {

    constructor(public http: Http) {
    }

    public getAlertAreas(token) : any {
        if (token) {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Accept", "application/json");
            headers.append("Authorization", "Token " + token);
            var options = new RequestOptions({ headers: headers });
            
            return this.http.get(`https://bikemaps.org/alertareas.json`, options)
            .map(res => res.json())
            .catch(this.catchError);
            
        }
    }

    public submitAlertArea(data: any, token: string) : any {
        if (token) {
            const headers = new Headers();
            headers.append("Accept", "application/json");
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", "Token " + token);
            const options = new RequestOptions({ headers: headers });
    
            return this.http.post(`https://bikemaps.org/alertareas/`, data, options)
            .map(res => res.json())
            .catch(this.catchError);
        }
    }

    public deleteAlertArea(id: string, token: string) {
        if (token) {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Accept", "application/json");
            headers.append("Authorization", "Token " + token);
            var options = new RequestOptions({ headers: headers });
            
            return this.http.delete(`https://bikemaps.org/alertareas/${id}.json`, options)
            .map(res => res.json())
            .catch(this.catchError);
        }
    }

    public deleteAlertAreas(id: string, token: string): any {
        if (token) {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Accept", "application/json");
            headers.append("Authorization", "Token " + token);
            var options = new RequestOptions({ headers: headers });
            
            return this.http.delete(`https://bikemaps.org/alertareas/${id}/.json`)
            .map(res => res.json())
            .catch(this.catchError);
        }
    }

    private catchError(error: Response) {
        return Observable.throw(error.json().error || { error: "Unable to retrieve alert areas." });
    }
}
