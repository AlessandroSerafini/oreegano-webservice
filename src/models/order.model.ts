import {Entity, model, property} from '@loopback/repository';


@model()
export class Order extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    required: false,
  })
  id?: number;

  @property({
    type: 'string',
    required: true
  })
  date: string;

  @property({
    type: 'string',
  })
  userName: string;

  @property({
    type: 'string',
  })
  userEmail: string;

  @property({
    type: 'string',
  })
  userAddress: string;

  @property({
    type: 'string',
  })
  userPostalCode: string;

  @property({
    type: 'string',
  })
  userCity: string;

  @property({
    type: 'string',
  })
  userState: string;

  @property({
    type: 'Number',
    generated: false,
    required: true,
    dataType: 'decimal',
    precision: 12,
    scale: 6
  })
  userLat: Number;

  @property({
    type: 'Number',
    generated: false,
    required: true,
    dataType: 'decimal',
    precision: 12,
    scale: 6
  })
  userLon: Number;

  @property({
    type: 'number',
  })
  userId: number;

  @property({
    type: 'string',
    generated: false,
    required: true,
  })
  boxTitle: string;

  @property({
    type: 'string',
    generated: false,
    required: true,
  })
  boxDescription: string;

  @property({
    type: 'string',
    generated: false,
    required: true,
  })
  boxImageUrl: string;

  @property({
    type: 'number',
    generated: false,
    required: true,
    dataType: 'decimal',
    precision: 12,
    scale: 2
  })
  boxPrice: number;

  @property({
    type: 'number',
    generated: false,
    required: false,
    dataType: 'decimal',
    precision: 12,
    scale: 2
  })
  boxOldPrice?: number;

  @property({
    type: 'string',
    generated: false,
    required: true,
  })
  storeTitle: string;

  @property({
    type: 'Number',
    generated: false,
    required: true,
    dataType: 'decimal',
    precision: 12,
    scale: 6
  })
  storeLat: Number;

  @property({
    type: 'Number',
    generated: false,
    required: true,
    dataType: 'decimal',
    precision: 12,
    scale: 6
  })
  storeLon: Number;

  @property({
    type: 'string',
    generated: false,
    required: true,
  })
  storeAddress: string;

  @property({
    type: 'string',
    generated: false,
    required: false,
  })
  storeDescription?: string;

  @property({
    type: 'string',
    generated: false,
    required: false,
  })
  storePhoneNumber?: string;

  @property({
    type: 'string',
    generated: false,
    required: false,
  })
  paymentMethod: string;

  @property({
    type: 'number',
    generated: false,
    required: false,
  })
  runner: number;

  constructor(data?: Partial<Order>) {
    super(data);
  }
}

export interface OrderRelations {
  // describe navigational properties here
}

export type OrderWithRelations = Order & OrderRelations;
