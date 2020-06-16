import { belongsTo, Entity, model, property } from '@loopback/repository';
import { Store } from "./store.model";
import { MisteryBox } from "./mistery-box.model";

@model()
export class MisteryBoxStore extends Entity {
    @property({
        type: 'number',
        id: true,
        generated: true,
        required: false,
    })
    id?: number;

    @belongsTo(() => MisteryBox)
    idMisteryBox: number;

    @belongsTo(() => Store)
    idStore: number;


    constructor(data?: Partial<MisteryBoxStore>) {
        super(data);
    }
}

export interface MisteryBoxStoreRelations {

}

export type MisteryBoxStoreWithRelations = MisteryBoxStore & MisteryBoxStoreRelations;
