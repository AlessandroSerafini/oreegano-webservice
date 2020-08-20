import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {OreeganoWsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {MisteryBox, MisteryBoxRelations} from "../models/mistery-box.model";
import {Store} from '../models';
import {StoreRepository} from './store.repository';

export class MisteryBoxRepository extends DefaultCrudRepository<
  MisteryBox,
  typeof MisteryBox.prototype.id,
  MisteryBoxRelations
> {

  public readonly store: BelongsToAccessor<Store, typeof MisteryBox.prototype.id>;

  constructor(
    @inject('datasources.OreeganoWs') dataSource: OreeganoWsDataSource, @repository.getter('StoreRepository') protected storeRepositoryGetter: Getter<StoreRepository>,
  ) {
    super(MisteryBox, dataSource);
    this.store = this.createBelongsToAccessorFor('store', storeRepositoryGetter,);
    this.registerInclusionResolver('store', this.store.inclusionResolver);
  }
}
