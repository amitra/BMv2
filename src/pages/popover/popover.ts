import { Component } from '@angular/core';
import { ModalController, NavController, ViewController } from 'ionic-angular';
import { AboutPage } from "../../pages/about/about";
import { SettingsPage } from "../../pages/settings/settings";
import { LoginModal } from "../login/login";
import { AuthService } from "../../services/AuthService";
import { NotificationsPage } from "../../pages/notifications/notifications";

@Component({
    selector: 'page-popover',
    templateUrl: 'popover.html'
})

export class PopoverPage {

    public isAuthenticated: boolean;

    constructor(private authService: AuthService, private modalCtrl: ModalController, private navCtrl: NavController, private viewCtrl: ViewController) {
        this.isAuthenticated = this.authService.isAuthenticated;
    }

    // Go to the about page
    openNotificationsPage = () => {
        this.navCtrl.push(NotificationsPage);
        this.close();
    }

    // Open the login dialog
    openLoginModal = () => {
        const modal = this.modalCtrl.create(LoginModal);
        modal.present()
        this.close();
    }

    // Go to the about page
    openAboutPage = () => {
        this.navCtrl.push(AboutPage);
        this.close();
    }

    // Go to the settings page
    openSettingsPage = () => {
        this.navCtrl.push(SettingsPage);
        this.close();
    }

    logout = () => {
        this.authService.logout();
        this.close();
    }

    // Close the popover
    close = () => {
        this.viewCtrl.dismiss();
    }
    
}
