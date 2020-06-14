import {DefaultCrudRepository} from '@loopback/repository';
import {TesiAlessandroSerafiniWsDataSource} from '../datasources';
import {inject} from '@loopback/core';
import {Role, RoleRelations} from "../models/role.model";
import {UserRoles} from "../utils/enums";

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype.id,
  RoleRelations
> {
  constructor(
    @inject('datasources.TesiAlessandroSerafiniWs') dataSource: TesiAlessandroSerafiniWsDataSource,
  ) {
    super(Role, dataSource);
  }

  public async initValues() {
    if (!await this.exists(UserRoles.STORE))
      await this.create(
          {
            id: UserRoles.STORE,
            description: 'Store'
          }
      );
    if (!await this.exists(UserRoles.CUSTOMER))
      await this.create(
          {
            id: UserRoles.CUSTOMER,
            description: 'Customer'
          }
      );

  }
}
