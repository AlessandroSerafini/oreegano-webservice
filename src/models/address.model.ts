import {Entity, model, property} from '@loopback/repository';

@model()
export class Address extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  address: string;

  @property({
    type: 'string',
    required: true,
  })
  postalCode: string;

  @property({
    type: 'string',
    required: true,
  })
  city: string;

  @property({
    type: 'string',
    required: true,
  })
  state: string;

  @property({
    type: 'number',
  })
  userId?: number;

  constructor(data?: Partial<Address>) {
    super(data);
  }
}

export interface AddressRelations {

}


export type AddressWithRelations = Address & AddressRelations;


