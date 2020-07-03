import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {OreeganoWsDataSource} from '../datasources';
import {Getter, inject} from '@loopback/core';
import {Store, StoreRelations} from "../models/store.model";
import {MisteryBox} from '../models';
import {MisteryBoxRepository} from './mistery-box.repository';

export class StoreRepository extends DefaultCrudRepository<
  Store,
  typeof Store.prototype.id,
  StoreRelations
> {

  public readonly misteryBoxes: HasManyRepositoryFactory<MisteryBox, typeof Store.prototype.id>;

  constructor(
    @inject('datasources.OreeganoWs') dataSource: OreeganoWsDataSource, @repository.getter('MisteryBoxRepository') protected misteryBoxRepositoryGetter: Getter<MisteryBoxRepository>,
  ) {
    super(Store, dataSource);
    this.misteryBoxes = this.createHasManyRepositoryFactoryFor('misteryBoxes', misteryBoxRepositoryGetter,);
    this.registerInclusionResolver('misteryBoxes', this.misteryBoxes.inclusionResolver);
  }
}
