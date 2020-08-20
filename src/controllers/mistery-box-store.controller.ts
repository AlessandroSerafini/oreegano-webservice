import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  MisteryBox,
  Store,
} from '../models';
import {MisteryBoxRepository} from '../repositories';

export class MisteryBoxStoreController {
  constructor(
    @repository(MisteryBoxRepository)
    public misteryBoxRepository: MisteryBoxRepository,
  ) { }

  @get('/mistery-boxes/{id}/store', {
    responses: {
      '200': {
        description: 'Store belonging to MisteryBox',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Store)},
          },
        },
      },
    },
  })
  async getStore(
    @param.path.number('id') id: typeof MisteryBox.prototype.id,
  ): Promise<Store> {
    return this.misteryBoxRepository.store(id);
  }
}
