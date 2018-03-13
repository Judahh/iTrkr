import { AddressType } from './addressType';
import { StreetType } from './streetType';

export class Address {

    type: AddressType;
    streetType: StreetType;
    street: string;
    number: string;
    complement: string;
    district: string;
    city: string;
    state: number;
    zipCode: string;

    constructor(type: AddressType,
        streetType: StreetType,
        street: string,
        number: string,
        complement: string,
        district: string,
        city: string,
        state: number,
        zipCode: string) {
        this.type = type;
        this.streetType = streetType;
        this.street = street;
        this.number = number;
        this.complement = complement;
        this.district = district;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
    }

}