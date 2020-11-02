import {Entity, hasMany, model, property} from '@loopback/repository';
import {UserRoles} from "../utils/enums";
import {Address} from './address.model';
import {Order} from './order.model';

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

  @hasMany(() => Address)
  addresses: Address[];

  @hasMany(() => Order)
  orders: Order[];

    constructor(data?: Partial<User>) {
        super(data);
    }
}

export interface UserRelations {

}


export type UserWithRelations = User & UserRelations;


