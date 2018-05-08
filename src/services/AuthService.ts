import { Events } from "ionic-angular"
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Storage } from '@ionic/storage';
import "rxjs/add/operator/map"
import "rxjs/add/operator/catch";

@Injectable()
export class AuthService {
    public isAuthenticated: boolean;
    public currentUser: any;
 
    constructor(private events: Events, private http: HttpClient, public storage: Storage) {
    }

    initialize(): any {
        this.storage.ready().then(() => {
            this.storage.get("currentUser").then((val) => {
                this.currentUser = val 
                
                if (this.currentUser) {
                    this.isAuthenticated = true;
                } else {
                    this.isAuthenticated = false;
                }
                this.events.publish("authService:initialized");
            });
        });
    }

    login(username: string, password: string): Observable<any> {
        const headers = new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

        return this.http.post("https://bikemaps.org/rest-auth/login/", { username: username, password: password }, { headers })
            .map((response: Response) => {
                // login successful if there's a key with a token in the response
                let token = response && response["key"]
                if (token) {
                    this.currentUser = { username: username, token: token };
                    this.isAuthenticated = true;
                    this.events.publish("authService:login");

                    // store username and token in local storage to keep user logged in between page refreshes
                    this.storage.ready().then(() =>  {
                        this.storage.set('currentUser', this.currentUser);
                    }).catch((err) => {
                        console.log(err)
                    });
                    
                    // return true to indicate successful login
                    return true;
                } else {
                    this.currentUser = undefined;
                    this.storage.remove("currentUser");
                    this.isAuthenticated = false;
                    // return false to indicate failed login
                    return false;
                }
            })
            .catch((err) => err);
    }

    logout(): void {
        this.isAuthenticated = false;
        this.storage.remove("currentUser");
        this.currentUser = undefined;
        this.events.publish("authService:logout");
    }

    register(username: string, password1: string, password2: string, email: string): Observable<any> {
        const headers = new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

        return this.http.post("https://bikemaps.org/rest-auth/registration/", { username: username, password1: password1, password2: password2, email: email }, { headers })
        .map((response: Response) => {
            console.log(response);
            return true;
        })
        .catch((err) => err);
    }

    reset(email: string): Observable<any> {
        const headers = new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

        return this.http.post("https://bikemaps.org/rest-auth/password/reset/", { email: email }, { headers })
        .map((response: Response) => {
            return true;
        })
        .catch((err) => err); 
    }
}