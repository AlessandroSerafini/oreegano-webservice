import {repository,} from '@loopback/repository';
import {get, getModelSchemaRef, param, Request, RestBindings,} from '@loopback/rest';
import {Store} from "../models/store.model";
import {StoreRepository} from "../repositories";
import {secured} from "../decorators/secured";
import {SecuredType} from "../utils/enums";
import {inject} from "@loopback/context";
import {MisteryBox} from "../models";

const jwt = require('jsonwebtoken');

export class StoreController {

    constructor(
        @inject(RestBindings.Http.REQUEST) private req: Request,
        @repository(StoreRepository) public storeRepository: StoreRepository,
    ) {
    }

    @get('/stores/near-me', {
        operationId: 'Stores near me',
        responses: {
            '200': {
                description: 'Array of Stores model instances',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: getModelSchemaRef(MisteryBox, {includeRelations: true}),
                        },
                    },
                },
            },
        },
    })
    @secured(SecuredType.IS_AUTHENTICATED)
    async find(
        @param.header.number('lat') currentLat,
        @param.header.number('lon') currentLon,
    ): Promise<Store[]> {
        let res: Store[] = [];
        const distanceFromMe = 25;
        const nearMeQuery = `SELECT id, SQRT( POW(69.1 * (lat - ${currentLat}), 2) + POW(69.1 * (${currentLon} - lon) * COS(lat / 57.3), 2)) AS distance FROM Store HAVING distance < ${distanceFromMe} ORDER BY distance`;
        const nearMeStoresIds: any[] = await this.storeRepository.dataSource.execute(nearMeQuery);
        const misteryBoxStoreFilter: any[] = [];
        if (nearMeStoresIds.length > 0) {
            nearMeStoresIds.forEach((store) => {
                misteryBoxStoreFilter.push({idStore: store.id});
            });

            res = await this.storeRepository.find({
                where: {or: misteryBoxStoreFilter},
                include: [{relation: 'misteryBoxes'}]
            });
        }
        return res;
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
