import { PhoneType } from './phoneType';
export class Phone {

    type: PhoneType;
    number: number;

    constructor(type: PhoneType,
        number: number) {
        this.number = number;
        this.type = type;
    }

}