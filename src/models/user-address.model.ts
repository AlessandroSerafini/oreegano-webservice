import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Store} from "./store.model";
import {MisteryBox} from "./mistery-box.model";
import {Address} from "./address.model";
import {User} from "./user.model";

@model()
export class UserAddress extends Entity {
    @property({
        type: 'number',
        id: true,
        generated: true,
        required: false,
    })
    id?: number;

    @belongsTo(() => User, {name: "user"})
    idUser: number;

    @belongsTo(() => Address, {name: "address"})
    idAddress: number;


    constructor(data?: Partial<UserAddress>) {
        super(data);
    }
}

export interface UserAddressRelations {

}

export type UserAddressWithRelations = UserAddress & UserAddressRelations;
