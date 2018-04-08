import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthService } from "../../services/AuthService";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'register-modal',
  templateUrl: 'register.html'
})

export class RegisterModal {
    private username: string;
    private email: string;
    private password1: string;
    private password2: string;
    private errors: any = {};
    private complete: boolean = false;

    constructor(private authService: AuthService, private translate: TranslateService, public viewCtrl: ViewController) {
    }

    register = () => {
        this.errors = {};
        if (this.validate()) {
            this.authService.register(this.username, this.password1, this.password2, this.email).subscribe((result) => {
                if (result === true) {
                    this.complete = true;
                } else if (result === false) {
                    this.errors.push("");    
                } else {
                    this.errors = result;
                }
            });
        }     
    }
    

    validate = () => {
        let isValid = true;

        if (this.username === undefined) {
            this.errors.username = [this.translate.instant("REGISTER.REQUIRED")];
            isValid = false;
        }
        if (this.email === undefined) {
            this.errors.email = [this.translate.instant("REGISTER.REQUIRED")];
            isValid = false;
        }
        if (this.password1 === undefined) {
            this.errors.password1 = [this.translate.instant("REGISTER.REQUIRED")];
            isValid = false;
        }
        if (this.password2 === undefined) {
            this.errors.password2 = [this.translate.instant("REGISTER.REQUIRED")];
            isValid = false;
        }
        if (this.password1 !== this.password2) {
            this.errors.password2 = [this.translate.instant("REGISTER.MATCH")];
            isValid = false;
        }

        return isValid;
    }

    dismiss = () => {
        this.viewCtrl.dismiss();
    }
}
