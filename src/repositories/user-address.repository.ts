import {DefaultCrudRepository} from '@loopback/repository';
import {OreeganoWsDataSource} from '../datasources';
import {inject} from '@loopback/core';
import {UserAddress, UserAddressRelations} from "../models/user-address.model";

export class UserAddressRepository extends DefaultCrudRepository<
  UserAddress,
  typeof UserAddress.prototype.id,
  UserAddressRelations
> {
  constructor(
    @inject('datasources.OreeganoWs') dataSource: OreeganoWsDataSource,
  ) {
    super(UserAddress, dataSource);
  }

  public async createUserAddressRelation(idUser: number, idAddress: number): Promise<null> {
    await this.create({
      idUser,
      idAddress
    });
    return new Promise(resolve => resolve());
  }
}
