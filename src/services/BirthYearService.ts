import { Injectable } from '@angular/core';

@Injectable()
export class BirthYearService {
    maxYear;
    years;

    constructor() {
        this.maxYear = new Date().getFullYear() - 13;
        this.years = [{key: undefined, text: "---------"}];
        this.setYears();
    }

    public getYears = () => {
        return this.years;
    }

    setYears = () => {
        for (let i = 0; i < 100; i++) {
            this.years.push({ key: (this.maxYear-i).toString(), text: (this.maxYear-i).toString() });
        }
    }
} 