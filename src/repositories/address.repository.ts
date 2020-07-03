import {DefaultCrudRepository} from '@loopback/repository';
import {OreeganoWsDataSource} from '../datasources';
import {inject} from '@loopback/core';
import {Address, AddressRelations} from "../models/address.model";

export class AddressRepository extends DefaultCrudRepository<
  Address,
  typeof Address.prototype.id,
  AddressRelations
> {
  constructor(
    @inject('datasources.OreeganoWs') dataSource: OreeganoWsDataSource,
  ) {
    super(Address, dataSource);
  }
}
