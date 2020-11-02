import {Entity, hasMany, model, property} from '@loopback/repository';
import {MisteryBox} from "./mistery-box.model";

@model()
export class Store extends Entity {
    @property({
        type: 'number',
        id: true,
        generated: true,
        required: false,
    })
    id?: number;

    @property({
        type: 'string',
        generated: false,
        required: true,
    })
    title: string;

    @property({
        type: 'Number',
        generated: false,
        required: true,
        dataType: 'decimal',
        precision: 12,
        scale: 6
    })
    lat: Number;

    @property({
        type: 'Number',
        generated: false,
        required: true,
        dataType: 'decimal',
        precision: 12,
        scale: 6
    })
    lon: Number;

    @property({
        type: 'string',
        generated: false,
        required: true,
    })
    address: string;

    @property({
        type: 'string',
        generated: false,
        required: false,
    })
    description?: string;

    @property({
        type: 'string',
        generated: false,
        required: false,
    })
    phoneNumber?: string;

    @property({
        type: 'boolean',
        required: false,
        default: 0,
    })
    haveDelivery?: boolean;

    @hasMany(() => MisteryBox, {keyTo: 'storeId'})
    misteryBoxes: MisteryBox[];

    constructor(data?: Partial<Store>) {
        super(data);
    }
}

export interface StoreRelations {
    // describe navigational properties here
}

export type StoreWithRelations = Store & StoreRelations;
