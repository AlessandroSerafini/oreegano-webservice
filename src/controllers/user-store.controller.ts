import {Filter, repository,} from '@loopback/repository';
import {get, getModelSchemaRef, param, post, requestBody,} from '@loopback/rest';
import {Store, User,} from '../models';
import {UserRepository} from '../repositories';
import {secured} from "../decorators/secured";
import {SecuredType, UserRoles} from "../utils/enums";

export class UserStoreController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/stores', {
    operationId: 'Get user stores',
    responses: {
      '200': {
        description: 'Array of User has many Store',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Store)},
          },
        },
      },
    },
  })
  @secured(SecuredType.HAS_ROLE, UserRoles.CUSTOMER)
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Store>,
  ): Promise<Store[]> {
    return this.userRepository.stores(id).find(filter);
  }

  @post('/users/{id}/stores', {
    operationId: 'Create user store',
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Store)}},
      },
    },
  })
  @secured(SecuredType.HAS_ROLE, UserRoles.CUSTOMER)
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Store, {
            title: 'NewStoreInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) store: Omit<Store, 'id'>,
  ): Promise<Store> {
    return this.userRepository.stores(id).create(store);
  }

  /*@patch('/users/{id}/stores', {
    responses: {
      '200': {
        description: 'User.Store PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Store, {partial: true}),
        },
      },
    })
    store: Partial<Store>,
    @param.query.object('where', getWhereSchemaFor(Store)) where?: Where<Store>,
  ): Promise<Count> {
    return this.userRepository.stores(id).patch(store, where);
  }*/

  /*@del('/users/{id}/stores', {
    responses: {
      '200': {
        description: 'User.Store DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Store)) where?: Where<Store>,
  ): Promise<Count> {
    return this.userRepository.stores(id).delete(where);
  }*/
}
