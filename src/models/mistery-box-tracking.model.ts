import {belongsTo, Entity, model, property} from '@loopback/repository';
import {MisteryBox} from "./mistery-box.model";
import {User} from "./user.model";

@model()
export class MisteryBoxTracking extends Entity {
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
        required: false,
    })
    lat?: string;

    @property({
        type: 'string',
        generated: false,
        required: false,
    })
    lon?: string;

    @belongsTo(() => MisteryBox, {name: "misteryBox"})
    idMisteryBox: number;

    @belongsTo(() => User, {name: "customer"})
    idCustomer: number;

    @belongsTo(() => User, {name: "delivery"})
    idDelivery?: number;


    constructor(data?: Partial<MisteryBoxTracking>) {
        super(data);
    }
}

export interface MisteryBoxTrackingRelations {

}

export type MisteryBoxTrackingWithRelations = MisteryBoxTracking & MisteryBoxTrackingRelations;
