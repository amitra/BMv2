import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import { BasicSelectItems } from "../basic_select_items/basic_select_items";

@Component({
    selector: 'basic-select',
    templateUrl: 'basic_select.html'
})

export class BasicSelect {
    @Input() displayText: string;
    @Input() headerText: string;
    @Input() items: any;

    @Input()
    get selectedItem() {
        return this.selectedItemValue;
    }
    set selectedItem(value) {
        this.selectedItemValue = value;
        this.selectedItemChange.emit(this.selectedItemValue);
    }

    @Output() selectedItemChange = new EventEmitter();

    selectedItemValue: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrlr: ModalController) {
    }

    showItems = (event) => {
        event.preventDefault();
        const params = {
            "headerText": this.headerText,
            "items": this.items
        };
        const modal = this.modalCtrlr.create(BasicSelectItems, params);

        modal.onDidDismiss((selection) => {
            if (selection !== undefined && selection !== null) {
                this.selectedItem = selection;
            }
        });
        
        modal.present();
    }
}
