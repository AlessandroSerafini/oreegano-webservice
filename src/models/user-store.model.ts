import { belongsTo, Entity, model, property } from '@loopback/repository';
import { User } from "./user.model";
import { Store } from "./store.model";

@model()
export class UserStore extends Entity {
    @property({
        type: 'number',
        id: true,
        generated: true,
    })
    id?: number;

    @belongsTo(() => User, {name: "user"})
    idUser: number;

    @belongsTo(() => Store, {name: "store"})
    idStore: number;

    constructor(data?: Partial<UserStore>) {
        super(data);
    }
}

export interface UserStoreRelations {
    // describe navigational properties here
}

export type UserStoreWithRelations = UserStore & UserStoreRelations;
