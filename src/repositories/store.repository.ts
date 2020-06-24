import { DefaultCrudRepository } from '@loopback/repository';
import { OreeganoWsDataSource } from '../datasources';
import { inject } from '@loopback/core';
import { Store, StoreRelations } from "../models/store.model";

export class StoreRepository extends DefaultCrudRepository<
  Store,
  typeof Store.prototype.id,
  StoreRelations
> {
  constructor(
    @inject('datasources.OreeganoWs') dataSource: OreeganoWsDataSource,
  ) {
    super(Store, dataSource);
  }
}
