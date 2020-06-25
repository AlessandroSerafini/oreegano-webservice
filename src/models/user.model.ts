import { Entity, model, property } from '@loopback/repository';
import { UserRoles } from "../utils/enums";

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
    role: UserRoles;

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

    @property({
        type: 'string',
        required: false
    })
    pswRecToken?: string;

    @property({
        type: 'date',
        required: false
    })
    pswRecTokenExpireDate?: Date;

    @property({
        type: 'date',
        required: false
    })
    pswRecExpireDate?: Date;


    constructor(data?: Partial<User>) {
        super(data);
    }
}

export interface UserRelations {

}


export type UserWithRelations = User & UserRelations;


