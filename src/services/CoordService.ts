import { Injectable } from '@angular/core';

@Injectable()
export class CoordService {

    dirty: boolean;
    coordinates: number[];

    constructor() {
    }

    Initialize() {
        this.dirty= false;
        this.coordinates = [0,0];
    }
}