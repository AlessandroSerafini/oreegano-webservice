import {DefaultCrudRepository} from '@loopback/repository';
import {TesiAlessandroSerafiniWsDataSource} from '../datasources';
import {inject} from '@loopback/core';
import {UserRole, UserRoleRelations} from "../models/user-role.model";

export class UserRoleRepository extends DefaultCrudRepository<
  UserRole,
  typeof UserRole.prototype.id,
  UserRoleRelations
> {
  constructor(
    @inject('datasources.TesiAlessandroSerafiniWs') dataSource: TesiAlessandroSerafiniWsDataSource,
  ) {
    super(UserRole, dataSource);
  }
}
