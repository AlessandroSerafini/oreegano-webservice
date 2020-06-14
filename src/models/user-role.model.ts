import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User} from "./user.model";
import {Role} from "./role.model";

@model()
export class UserRole extends Entity {
    @property({
        type: 'number',
        id: true,
        generated: true,
    })
    id?: number;

    @belongsTo(() => User, {name: "user"})
    idUser: number;

    @belongsTo(() => Role, {name: "role"})
    idRole: number;

    constructor(data?: Partial<UserRole>) {
        super(data);
    }
}

export interface UserRoleRelations {
    // describe navigational properties here
}

export type UserRoleWithRelations = UserRole & UserRoleRelations;
