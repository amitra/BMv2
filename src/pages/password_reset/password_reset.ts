import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { AuthService } from "../../services/AuthService";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'password-reset-modal',
  templateUrl: 'password_reset.html'
})

export class PasswordResetModal {
    private email: string;
    private errors: any[] = [];
    protected complete: boolean;

    constructor(private authService: AuthService, private translate: TranslateService, public viewCtrl: ViewController) {
        this.complete = false;
    }

    reset = () => {
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
        } else {
            this.complete = false;
        }     
    }
    

    validate = () => {
        let isValid = true;

        if (this.email === undefined) {
            this.errors = [this.translate.instant("REGISTER.REQUIRED")];
            isValid = false;
        }

        return isValid;
    }

    dismiss = () => {
        this.viewCtrl.dismiss();
    }
}
