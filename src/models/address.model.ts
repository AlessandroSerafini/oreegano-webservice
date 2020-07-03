import {Entity, model, property} from '@loopback/repository';
import {UserRoles} from "../utils/enums";

@model()
export class Address extends Entity {
    @property({
        type: 'number',
        id: true,
        generated: true,
    })
    id?: number;

    @property({
        type: 'string',
        required: true,
    })
    address: string;

    @property({
        type: 'string',
        required: true,
    })
    postalCode: string;

    @property({
        type: 'string',
        required: true,
    })
    city: string;

    @property({
        type: 'string',
        required: true,
    })
    state: string;


    constructor(data?: Partial<Address>) {
        super(data);
    }
}

export interface AddressRelations {

}


export type AddressWithRelations = Address & AddressRelations;


