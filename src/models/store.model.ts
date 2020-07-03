import {Entity, hasMany, model, property} from '@loopback/repository';
import {MisteryBox} from "./mistery-box.model";

@model()
export class Store extends Entity {
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
    type: 'number',
    generated: false,
    required: true,
    mysql: {
      dataType: 'float',
    }
  })
  lat: number;

  @property({
    type: 'number',
    generated: false,
    required: true,
    mysql: {
      dataType: 'float',
    }
  })
  lon: number;

  @property({
    type: 'string',
    generated: false,
    required: true,
  })
  address: string;

  @property({
    type: 'string',
    generated: false,
    required: false,
  })
  description?: string;

  @property({
    type: 'string',
    generated: false,
    required: false,
  })
  phoneNumber?: string;

  @property({
    type: 'boolean',
    required: false,
    default: 0,
  })
  haveDelivery?: boolean;

  @hasMany(() => MisteryBox)
  misteryBoxes: MisteryBox[];

  @property({
    type: 'number',
  })
  userId?: number;

  constructor(data?: Partial<Store>) {
    super(data);
  }
}

export interface StoreRelations {
    // describe navigational properties here
}

export type StoreWithRelations = Store & StoreRelations;
