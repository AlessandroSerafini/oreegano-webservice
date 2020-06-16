import {DefaultCrudRepository} from '@loopback/repository';
import {TesiAlessandroSerafiniWsDataSource} from '../datasources';
import {inject} from '@loopback/core';
import { UserStore, UserStoreRelations } from "../models/user-store.model";
import { User } from "../models/user.model";
import { UserRoles } from "../utils/enums";

export class UserStoreRepository extends DefaultCrudRepository<
  UserStore,
  typeof UserStore.prototype.id,
  UserStoreRelations
> {
  constructor(
    @inject('datasources.TesiAlessandroSerafiniWs') dataSource: TesiAlessandroSerafiniWsDataSource,
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
