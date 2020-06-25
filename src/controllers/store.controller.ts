import { repository, } from '@loopback/repository';
import { getModelSchemaRef, post, requestBody, RestBindings, Request, HttpErrors, } from '@loopback/rest';
import { Store } from "../models/store.model";
import { StoreRepository, UserStoreRepository } from "../repositories";
import { secured } from "../decorators/secured";
import { SecuredType, UserRoles } from "../utils/enums";
import { inject } from "@loopback/context";
import { environment } from "../env/environment";
const jwt = require('jsonwebtoken');

export class StoreController {

  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @repository(StoreRepository) public storeRepository : StoreRepository,
    @repository(UserStoreRepository) public userStoreRepository : UserStoreRepository,
  ) {}

  @post('/stores/create', {
    operationId: 'Create store',
    responses: {
      '200': {
        description: 'Store model instance',
        content: {'application/json': {schema: getModelSchemaRef(Store)}},
      },
    },
  })
  @secured(SecuredType.IS_AUTHENTICATED)
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Store, {
            title: 'NewStore',
            exclude: ['id'],
          }),
        },
      },
    })
    store: Omit<Store, 'id'>,
  ): Promise<Store> {
    const newStore:Store = await this.storeRepository.create(store);
    if(newStore.id){
      const authorization = this.req.headers?.authorization?.split(' ')[1];
      let idUser:number;
      try {
        idUser = jwt.verify(authorization,environment.JWT_SECRET).idUser;
      } catch (e) {
        throw new HttpErrors.Unauthorized('Invalid authorization');
      }
      await this.userStoreRepository.createUserStoreRelation(idUser, newStore.id);
    }
    return newStore;
  }

  /*@get('/stores/count', {
    responses: {
      '200': {
        description: 'Store model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Store) where?: Where<Store>,
  ): Promise<Count> {
    return this.storeRepository.count(where);
  }*/

  /*@get('/stores', {
    responses: {
      '200': {
        description: 'Array of Store model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Store, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Store) filter?: Filter<Store>,
  ): Promise<Store[]> {
    return this.storeRepository.find(filter);
  }*/

  /*@patch('/stores', {
    responses: {
      '200': {
        description: 'Store PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Store, {partial: true}),
        },
      },
    })
    store: Store,
    @param.where(Store) where?: Where<Store>,
  ): Promise<Count> {
    return this.storeRepository.updateAll(store, where);
  }*/

  /*@get('/stores/{id}', {
    responses: {
      '200': {
        description: 'Store model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Store, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Store, {exclude: 'where'}) filter?: FilterExcludingWhere<Store>
  ): Promise<Store> {
    return this.storeRepository.findById(id, filter);
  }*/

  /*@patch('/stores/{id}', {
    responses: {
      '204': {
        description: 'Store PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Store, {partial: true}),
        },
      },
    })
    store: Store,
  ): Promise<void> {
    await this.storeRepository.updateById(id, store);
  }*/

  /*@put('/stores/{id}', {
    responses: {
      '204': {
        description: 'Store PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() store: Store,
  ): Promise<void> {
    await this.storeRepository.replaceById(id, store);
  }*/

  /*@del('/stores/{id}', {
    responses: {
      '204': {
        description: 'Store DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.storeRepository.deleteById(id);
  }*/
}
