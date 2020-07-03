import {Filter, repository,} from '@loopback/repository';
import {get, getModelSchemaRef, param, post, requestBody,} from '@loopback/rest';
import {MisteryBox, Store,} from '../models';
import {StoreRepository} from '../repositories';
import {secured} from "../decorators/secured";
import {SecuredType, UserRoles} from "../utils/enums";

export class StoreMisteryBoxController {
  constructor(
    @repository(StoreRepository) protected storeRepository: StoreRepository,
  ) { }

  @get('/stores/{id}/mistery-boxes', {
    operationId: 'Get store mistery boxes',
    responses: {
      '200': {
        description: 'Array of Store has many MisteryBox',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(MisteryBox)},
          },
        },
      },
    },
  })
  @secured(SecuredType.IS_AUTHENTICATED)
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<MisteryBox>,
  ): Promise<MisteryBox[]> {
    return this.storeRepository.misteryBoxes(id).find(filter);
  }

  @post('/stores/{id}/mistery-boxes', {
    operationId: 'Create store mistery box',
    responses: {
      '200': {
        description: 'Store model instance',
        content: {'application/json': {schema: getModelSchemaRef(MisteryBox)}},
      },
    },
  })
  @secured(SecuredType.HAS_ROLE, UserRoles.CUSTOMER)
  async create(
    @param.path.number('id') id: typeof Store.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MisteryBox, {
            title: 'NewMisteryBoxInStore',
            exclude: ['id'],
            optional: ['storeId']
          }),
        },
      },
    }) misteryBox: Omit<MisteryBox, 'id'>,
  ): Promise<MisteryBox> {
    return this.storeRepository.misteryBoxes(id).create(misteryBox);
  }

  /*@patch('/stores/{id}/mistery-boxes', {
    responses: {
      '200': {
        description: 'Store.MisteryBox PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MisteryBox, {partial: true}),
        },
      },
    })
    misteryBox: Partial<MisteryBox>,
    @param.query.object('where', getWhereSchemaFor(MisteryBox)) where?: Where<MisteryBox>,
  ): Promise<Count> {
    return this.storeRepository.misteryBoxes(id).patch(misteryBox, where);
  }*/

  /*@del('/stores/{id}/mistery-boxes', {
    responses: {
      '200': {
        description: 'Store.MisteryBox DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(MisteryBox)) where?: Where<MisteryBox>,
  ): Promise<Count> {
    return this.storeRepository.misteryBoxes(id).delete(where);
  }*/
}
