import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ModalController, NavController, NavParams } from "ionic-angular";
import { GroupSelectItems } from "../group_select_items/group_select_items";

@Component({
    selector: "group-select",
    templateUrl: "group_select.html"
})

export class GroupSelect {
    @Input() displayText: string;
    @Input() headerText: string;
    @Input() groups: any;

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
            "groups": this.groups
        };
        const groupModal = this.modalCtrlr.create(GroupSelectItems, params);

        groupModal.onDidDismiss((selection) => {
            if (selection !== undefined && selection !== null) {
                this.selectedItem = selection;
            }
        });
        
        groupModal.present().then().catch((x) => console.log(x));
    }
}
