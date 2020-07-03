import {Entity, hasOne, model, property} from '@loopback/repository';
import {MisteryBoxStore} from "./mistery-box-store.model";

@model()
export class MisteryBox extends Entity {
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
        type: 'string',
        generated: false,
        required: true,
    })
    description: string;

    @property({
        type: 'number',
        generated: false,
        required: true,
        mysql: {
            dataType: 'float',
        }
    })
    price: number;

    @property({
        type: 'number',
        generated: false,
        required: false,
        mysql: {
            dataType: 'float',
        }
    })
    oldPrice?: number;

    @property({
        type: 'string',
        generated: false,
        required: false,
    })
    date: Date;

    @property({
        type: 'number',
        generated: false,
        required: false,
    })
    available: number;

    @hasOne(() => MisteryBoxStore)
    misteryBoxStore?: MisteryBoxStore;

    constructor(data?: Partial<MisteryBox>) {
        super(data);
    }
}

export interface MisteryBoxRelations {

}


export type MisteryBoxWithRelations = MisteryBox & MisteryBoxRelations;


