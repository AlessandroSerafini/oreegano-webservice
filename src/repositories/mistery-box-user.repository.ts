import {DefaultCrudRepository} from '@loopback/repository';
import {OreeganoWsDataSource} from '../datasources';
import {inject} from '@loopback/core';
import {MisteryBoxUser, MisteryBoxUserRelations} from "../models/mistery-box-user.model";

export class MisteryBoxUserRepository extends DefaultCrudRepository<
  MisteryBoxUser,
  typeof MisteryBoxUser.prototype.id,
  MisteryBoxUserRelations
> {
  constructor(
    @inject('datasources.OreeganoWs') dataSource: OreeganoWsDataSource,
  ) {
    super(MisteryBoxUser, dataSource);
  }
}
