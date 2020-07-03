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
  requestBody, HttpErrors, RestBindings, Request,
} from '@loopback/rest';
import {AddressRepository, UserAddressRepository} from '../repositories';
import {Address} from "../models/address.model";
import {MisteryBox} from "../models/mistery-box.model";
import {secured} from "../decorators/secured";
import {SecuredType, UserRoles} from "../utils/enums";
import {environment} from "../env/environment";
import {inject} from "@loopback/context";

const jwt = require('jsonwebtoken');

export class AddressController {
  constructor(
      @inject(RestBindings.Http.REQUEST) private req: Request,
    @repository(AddressRepository) public addressRepository : AddressRepository,
    @repository(UserAddressRepository) public userAddressRepository : UserAddressRepository,
  ) {}

  @post('/addresses/create', {
    operationId: 'Create new address',
    responses: {
      '200': {
        description: 'Address model instance',
        content: {'application/json': {schema: getModelSchemaRef(Address)}},
      },
    },
  })
  @secured(SecuredType.HAS_ROLE, UserRoles.CUSTOMER)
  async create(
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(Address, {
              title: 'NewAddress',
            }),
          },
        },
      })
          address: Address,
  ): Promise<Address> {
    const newAddress: Address = await this.addressRepository.create(address);
    if (newAddress.id) {
      const idUser = jwt.verify(this.req.headers?.authorization?.split(' ')[1], environment.JWT_SECRET).idUser;
      await this.userAddressRepository.createUserAddressRelation(idUser, newAddress.id);
    }
    return newAddress;
  }

  /*@get('/addresses/count', {
    responses: {
      '200': {
        description: 'Address model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Address) where?: Where<Address>,
  ): Promise<Count> {
    return this.addressRepository.count(where);
  }

  @get('/addresses', {
    responses: {
      '200': {
        description: 'Array of Address model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Address, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Address) filter?: Filter<Address>,
  ): Promise<Address[]> {
    return this.addressRepository.find(filter);
  }

  @patch('/addresses', {
    responses: {
      '200': {
        description: 'Address PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Address, {partial: true}),
        },
      },
    })
    address: Address,
    @param.where(Address) where?: Where<Address>,
  ): Promise<Count> {
    return this.addressRepository.updateAll(address, where);
  }

  @get('/addresses/{id}', {
    responses: {
      '200': {
        description: 'Address model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Address, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Address, {exclude: 'where'}) filter?: FilterExcludingWhere<Address>
  ): Promise<Address> {
    return this.addressRepository.findById(id, filter);
  }

  @patch('/addresses/{id}', {
    responses: {
      '204': {
        description: 'Address PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Address, {partial: true}),
        },
      },
    })
    address: Address,
  ): Promise<void> {
    await this.addressRepository.updateById(id, address);
  }

  @put('/addresses/{id}', {
    responses: {
      '204': {
        description: 'Address PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() address: Address,
  ): Promise<void> {
    await this.addressRepository.replaceById(id, address);
  }

  @del('/addresses/{id}', {
    responses: {
      '204': {
        description: 'Address DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.addressRepository.deleteById(id);
  }*/
}
