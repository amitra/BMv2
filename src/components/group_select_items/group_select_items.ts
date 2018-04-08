import { Component, Input } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
    selector: 'group-select-items',
    templateUrl: 'group_select_items.html'
})

export class GroupSelectItems {
    headerText: string = this.navParams.get("headerText");
    groups: any[] = this.navParams.get("groups");

    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    }

    itemSelected = (item) => {
        this.viewCtrl.dismiss(item);
    }
}