import { DefaultCrudRepository } from '@loopback/repository';
import { TesiAlessandroSerafiniWsDataSource } from '../datasources';
import { inject } from '@loopback/core';
import { MisteryBoxStore, MisteryBoxStoreRelations } from "../models/mistery-box-store.model";

export class MisteryBoxStoreRepository extends DefaultCrudRepository<
  MisteryBoxStore,
  typeof MisteryBoxStore.prototype.id,
  MisteryBoxStoreRelations
> {
  constructor(
    @inject('datasources.TesiAlessandroSerafiniWs') dataSource: TesiAlessandroSerafiniWsDataSource,
  ) {
    super(MisteryBoxStore, dataSource);
  }
}
