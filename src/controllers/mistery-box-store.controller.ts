import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {MisteryBoxStoreRepository} from "../repositories";
import {MisteryBoxStore} from "../models/mistery-box-store.model";

export class MisteryBoxStoreController {
  constructor(
    @repository(MisteryBoxStoreRepository)
    public misteryBoxStoreRepository : MisteryBoxStoreRepository,
  ) {}

  @post('/mistery-box-stores', {
    responses: {
      '200': {
        description: 'MisteryBoxStore model instance',
        content: {'application/json': {schema: getModelSchemaRef(MisteryBoxStore)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MisteryBoxStore, {
            title: 'NewMisteryBoxStore',
            exclude: ['id'],
          }),
        },
      },
    })
    misteryBoxStore: Omit<MisteryBoxStore, 'id'>,
  ): Promise<MisteryBoxStore> {
    return this.misteryBoxStoreRepository.create(misteryBoxStore);
  }

  @get('/mistery-box-stores/count', {
    responses: {
      '200': {
        description: 'MisteryBoxStore model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(MisteryBoxStore) where?: Where<MisteryBoxStore>,
  ): Promise<Count> {
    return this.misteryBoxStoreRepository.count(where);
  }

  @get('/mistery-box-stores', {
    responses: {
      '200': {
        description: 'Array of MisteryBoxStore model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(MisteryBoxStore, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(MisteryBoxStore) filter?: Filter<MisteryBoxStore>,
  ): Promise<MisteryBoxStore[]> {
    return this.misteryBoxStoreRepository.find(filter);
  }

  @patch('/mistery-box-stores', {
    responses: {
      '200': {
        description: 'MisteryBoxStore PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MisteryBoxStore, {partial: true}),
        },
      },
    })
    misteryBoxStore: MisteryBoxStore,
    @param.where(MisteryBoxStore) where?: Where<MisteryBoxStore>,
  ): Promise<Count> {
    return this.misteryBoxStoreRepository.updateAll(misteryBoxStore, where);
  }

  @get('/mistery-box-stores/{id}', {
    responses: {
      '200': {
        description: 'MisteryBoxStore model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(MisteryBoxStore, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(MisteryBoxStore, {exclude: 'where'}) filter?: FilterExcludingWhere<MisteryBoxStore>
  ): Promise<MisteryBoxStore> {
    return this.misteryBoxStoreRepository.findById(id, filter);
  }

  @patch('/mistery-box-stores/{id}', {
    responses: {
      '204': {
        description: 'MisteryBoxStore PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MisteryBoxStore, {partial: true}),
        },
      },
    })
    misteryBoxStore: MisteryBoxStore,
  ): Promise<void> {
    await this.misteryBoxStoreRepository.updateById(id, misteryBoxStore);
  }

  @put('/mistery-box-stores/{id}', {
    responses: {
      '204': {
        description: 'MisteryBoxStore PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() misteryBoxStore: MisteryBoxStore,
  ): Promise<void> {
    await this.misteryBoxStoreRepository.replaceById(id, misteryBoxStore);
  }

  @del('/mistery-box-stores/{id}', {
    responses: {
      '204': {
        description: 'MisteryBoxStore DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.misteryBoxStoreRepository.deleteById(id);
  }
}
