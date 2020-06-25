import {belongsTo, Entity, model, property} from '@loopback/repository';
import {MisteryBox} from "./mistery-box.model";
import {User} from "./user.model";

@model()
export class MisteryBoxUser extends Entity {
    @property({
        type: 'number',
        id: true,
        generated: true,
        required: false,
    })
    id?: number;

    @belongsTo(() => MisteryBox, {name: "misteryBox"})
    idMisteryBox: number;

    @belongsTo(() => User, {name: "user"})
    idUser: number;


    constructor(data?: Partial<MisteryBoxUser>) {
        super(data);
    }
}

export interface MisteryBoxUserRelations {

}

export type MisteryBoxUserWithRelations = MisteryBoxUser & MisteryBoxUserRelations;
