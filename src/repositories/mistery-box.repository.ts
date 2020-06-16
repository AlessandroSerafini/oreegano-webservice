import { DefaultCrudRepository } from '@loopback/repository';
import { TesiAlessandroSerafiniWsDataSource } from '../datasources';
import { inject } from '@loopback/core';
import { MisteryBox, MisteryBoxRelations } from "../models/mistery-box.model";

export class MisteryBoxRepository extends DefaultCrudRepository<
  MisteryBox,
  typeof MisteryBox.prototype.id,
  MisteryBoxRelations
> {
  constructor(
    @inject('datasources.TesiAlessandroSerafiniWs') dataSource: TesiAlessandroSerafiniWsDataSource,
  ) {
    super(MisteryBox, dataSource);
  }
}
