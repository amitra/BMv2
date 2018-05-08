import { Component } from '@angular/core';
import { ModalController, ViewController } from 'ionic-angular';
import { AuthService } from "../../services/AuthService";
import { RegisterModal } from "../register/register";
import { PasswordResetModal } from "../password_reset/password_reset";

@Component({
  selector: 'login-modal',
  templateUrl: 'login.html'
})

export class LoginModal {
    private username: string;
    private password: string;
    private errors: any[] = [];

    constructor(private authService: AuthService, private modalCtrl: ModalController, public viewCtrl: ViewController) {
    }


    login = () => {
        this.errors = [];
        if (this.username !== undefined && this.username !== "" && this.password !== undefined && this.password !== "") {
            this.authService.login(this.username, this.password).subscribe((result) => {
                if (result === true) {
                    this.dismiss();
                } else if (result === false) {
                    this.errors.push("");    
                } else {
                    this.errors = result;
                }
            });
        }
    }

    cancelLogin = () => {
        this.dismiss();
    }

    createAccount = () => {
        const modal = this.modalCtrl.create(RegisterModal);
        modal.present();
        this.dismiss();
    }

    resetPassword = () => {
        const modal = this.modalCtrl.create(PasswordResetModal);
        modal.present();
        this.dismiss();
    }

    dismiss = () => {
        this.viewCtrl.dismiss();
    }
}
