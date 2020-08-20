import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Store} from "./store.model";

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
    type: 'string',
    generated: false,
    required: true,
  })
  imageUrl: string;

  @property({
    type: 'number',
    generated: false,
    required: true,
    dataType: 'decimal',
    precision: 12,
    scale: 2
  })
  price: number;

  @property({
    type: 'number',
    generated: false,
    required: false,
    dataType: 'decimal',
    precision: 12,
    scale: 2
  })
  oldPrice?: number;

  @property({
    type: 'date',
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

  @belongsTo(() => Store)
  storeId: number;

  constructor(data?: Partial<MisteryBox>) {
    super(data);
  }
}

export interface MisteryBoxRelations {

}


export type MisteryBoxWithRelations = MisteryBox & MisteryBoxRelations;


