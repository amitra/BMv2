import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthService } from "../../services/AuthService";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'password-reset-modal',
  templateUrl: 'password_reset.html'
})

export class PasswordResetModal {
    private username: string;
    private email: string;
    private password1: string;
    private password2: string;
    private errors: any = {};
    private complete: boolean = false;

    constructor(private authService: AuthService, private translate: TranslateService, public viewCtrl: ViewController) {
    }

    reset = () => {
        this.errors = {};
        if (this.validate()) {
            this.authService.reset(this.email).subscribe((result) => {
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

        if (this.email === undefined) {
            this.errors.email = [this.translate.instant("REGISTER.REQUIRED")];
            isValid = false;
        }

        return isValid;
    }

    dismiss = () => {
        this.viewCtrl.dismiss();
    }
}
