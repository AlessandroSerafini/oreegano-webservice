import {DefaultCrudRepository} from '@loopback/repository';
import {OreeganoWsDataSource} from '../datasources';
import {inject} from '@loopback/core';
import {MisteryBoxTracking, MisteryBoxTrackingRelations} from "../models/mistery-box-tracking.model";

export class MisteryBoxTrackingRepository extends DefaultCrudRepository<
  MisteryBoxTracking,
  typeof MisteryBoxTracking.prototype.id,
  MisteryBoxTrackingRelations
> {
  constructor(
    @inject('datasources.OreeganoWs') dataSource: OreeganoWsDataSource,
  ) {
    super(MisteryBoxTracking, dataSource);
  }
}
