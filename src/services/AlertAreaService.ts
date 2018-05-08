import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Rx";


@Injectable()
export class AlertAreaService {

    constructor(public http: HttpClient) {
    }

    public getAlertAreas(token) : any {
        if (token) {
            const headers = new HttpHeaders()
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .set("Authorization", "Token " + token);
            
            return this.http.get(`https://bikemaps.org/alertareas.json`, { headers })
            .catch(this.catchError);
            
        }
    }

    public submitAlertArea(data: any, token: string) : any {
        if (token) {
            const headers = new HttpHeaders()
            .set("Accept", "application/json")
            .set("Content-Type", "application/json")
            .set("Authorization", "Token " + token);
    
            return this.http.post(`https://bikemaps.org/alertareas/`, data, { headers })
            .catch(this.catchError);
        }
    }

    public deleteAlertArea(id: string, token: string) {
        if (token) {
            const headers = new HttpHeaders()
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .set("Authorization", "Token " + token);
            
            return this.http.delete(`https://bikemaps.org/alertareas/${id}.json`, { headers })
            .catch(this.catchError);
        }
    }

    public deleteAlertAreas(id: string, token: string): any {
        if (token) {
            const headers = new HttpHeaders()
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .set("Authorization", "Token " + token);
            
            return this.http.delete(`https://bikemaps.org/alertareas/${id}/.json`, { headers })
            .catch(this.catchError);
        }
    }

    private catchError(error: Response) {
        return Observable.throw(error.json().error || { error: "Unable to retrieve alert areas." });
    }
}
