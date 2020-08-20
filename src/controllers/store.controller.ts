import {repository,} from '@loopback/repository';
import {Request, RestBindings,} from '@loopback/rest';
import {StoreRepository} from "../repositories";
import {inject} from "@loopback/context";

const jwt = require('jsonwebtoken');

export class StoreController {

    constructor(
        @inject(RestBindings.Http.REQUEST) private req: Request,
        @repository(StoreRepository) public storeRepository: StoreRepository,
    ) {
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
