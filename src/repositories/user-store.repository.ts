import {DefaultCrudRepository} from '@loopback/repository';
import {OreeganoWsDataSource} from '../datasources';
import {inject} from '@loopback/core';
import { UserStore, UserStoreRelations } from "../models/user-store.model";

export class UserStoreRepository extends DefaultCrudRepository<
  UserStore,
  typeof UserStore.prototype.id,
  UserStoreRelations
> {
  constructor(
    @inject('datasources.OreeganoWs') dataSource: OreeganoWsDataSource,
  ) {
    super(UserStore, dataSource);
  }

  public async createUserStoreRelation(idUser: number, idStore: number): Promise<null> {
    await this.create({
      idUser,
      idStore
    });
    return new Promise(resolve => resolve());
  }
}
