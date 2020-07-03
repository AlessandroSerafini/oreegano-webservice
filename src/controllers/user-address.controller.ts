import {Filter, repository,} from '@loopback/repository';
import {get, getModelSchemaRef, param, post, requestBody,} from '@loopback/rest';
import {Address, User,} from '../models';
import {UserRepository} from '../repositories';
import {secured} from "../decorators/secured";
import {SecuredType, UserRoles} from "../utils/enums";

export class UserAddressController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/addresses', {
    operationId: 'Get user addresses',
    responses: {
      '200': {
        description: 'Array of User has many Address',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Address)},
          },
        },
      },
    },
  })
  @secured(SecuredType.HAS_ROLE, UserRoles.CUSTOMER)
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Address>,
  ): Promise<Address[]> {
    return this.userRepository.addresses(id).find(filter);
  }

  @post('/users/{id}/addresses', {
    operationId: 'Create user address',
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Address)}},
      },
    },
  })
  @secured(SecuredType.HAS_ROLE, UserRoles.CUSTOMER)
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Address, {
            title: 'NewAddressInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) address: Omit<Address, 'id'>,
  ): Promise<Address> {
    return this.userRepository.addresses(id).create(address);
  }

  /*@patch('/users/{id}/addresses', {
    responses: {
      '200': {
        description: 'User.Address PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Address, {partial: true}),
        },
      },
    })
    address: Partial<Address>,
    @param.query.object('where', getWhereSchemaFor(Address)) where?: Where<Address>,
  ): Promise<Count> {
    return this.userRepository.addresses(id).patch(address, where);
  }*/

  /*@del('/users/{id}/addresses', {
    responses: {
      '200': {
        description: 'User.Address DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Address)) where?: Where<Address>,
  ): Promise<Count> {
    return this.userRepository.addresses(id).delete(where);
  }*/
}
