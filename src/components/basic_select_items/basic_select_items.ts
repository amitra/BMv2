import { Component, Input } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
    selector: 'basic-select-items',
    templateUrl: 'basic_select_items.html'
})

export class BasicSelectItems {
    headerText: string = this.navParams.get("headerText");
    items: any[] = this.navParams.get("items");

    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    }

    itemSelected = (item) => {
        console.log(item);
        this.viewCtrl.dismiss(item);
    }
}
