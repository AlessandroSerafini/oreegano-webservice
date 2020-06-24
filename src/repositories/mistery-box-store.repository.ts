import { DefaultCrudRepository } from '@loopback/repository';
import { OreeganoWsDataSource } from '../datasources';
import { inject } from '@loopback/core';
import { MisteryBoxStore, MisteryBoxStoreRelations } from "../models/mistery-box-store.model";

export class MisteryBoxStoreRepository extends DefaultCrudRepository<
  MisteryBoxStore,
  typeof MisteryBoxStore.prototype.id,
  MisteryBoxStoreRelations
> {
  constructor(
    @inject('datasources.OreeganoWs') dataSource: OreeganoWsDataSource,
  ) {
    super(MisteryBoxStore, dataSource);
  }
}
