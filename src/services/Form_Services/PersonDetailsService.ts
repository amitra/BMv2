import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class PersonalDetailsService {

    savePersonalDetails: boolean;
    birthYear : any;
    birthMonth: any;
    gender : any;
    frequency : any;

    constructor(private storage: Storage) {
    }

    
    Initialize() {
        this.storage.get("savePersonalDetails").then((val) => this.savePersonalDetails = val );
        this.storage.get("birthYear").then((val) => this.birthYear = val );
        this.storage.get("birthMonth").then((val) => this.birthMonth = val );
        this.storage.get("gender").then((val) => this.gender = val );
        this.storage.get("frequency").then((val) => this.frequency = val );
    }

    SaveDetails(details: any): void {
        if (details.savePersonalDetails) {
            this.storage.set("savePersonalDetails", details.savePersonalDetails);
            this.storage.set("birthMonth", details.birthMonth);
            this.storage.set("birthYear", details.birthYear);
            this.storage.set("gender", details.gender);
            this.storage.set("frequency", details.frequency);
        }
        else {
            this.storage.set("savePersonalDetails", details.savePersonalDetails);
            this.storage.set("birthMonth", "");
            this.storage.set("birthYear", "");
            this.storage.set("gender", "");
            this.storage.set("frequency", "");
        }
    }
}