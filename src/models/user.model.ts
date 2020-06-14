import {Entity, model, property} from '@loopback/repository';
import {UserRoles} from "../utils/enums";

export enum USER_TYPE {
    CUSTOMER = "CUSTOMER",
    STORE = "STORE",
}

@model()
export class User extends Entity {
    @property({
        type: 'number',
        id: true,
        generated: true,
    })
    id?: number;

    @property({
        type: 'number',
        required: true,
    })
    type: UserRoles;

    @property({
        type: 'string',
        required: true,
    })
    name: string;

    @property({
        type: 'string',
        required: true,
    })
    email: string;

    @property({
        type: 'string',
        required: true,
    })
    password: string;


    constructor(data?: Partial<User>) {
        super(data);
    }
}

export interface UserRelations {

}


export type UserWithRelations = User & UserRelations;

