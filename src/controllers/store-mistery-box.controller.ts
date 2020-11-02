import {Filter, repository,} from '@loopback/repository';
import {get, getModelSchemaRef, param, post, requestBody,} from '@loopback/rest';
import {MisteryBox, Store,} from '../models';
import {MisteryBoxRepository, StoreRepository} from '../repositories';
import {secured} from "../decorators/secured";
import {SecuredType, UserRoles} from "../utils/enums";
import {getMisteryBoxesWithDistance} from "../utils/mapping";

export class StoreMisteryBoxController {
    constructor(
        @repository(StoreRepository) protected storeRepository: StoreRepository,
        @repository(MisteryBoxRepository) public misteryBoxRepository: MisteryBoxRepository,
    ) {
    }

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
        @param.query.number('lat') currentLat,
        @param.query.number('lon') currentLon,
        @param.query.number('distance') distance,
        @param.path.number('id') id: number,
    ): Promise<MisteryBox[]> {
        return getMisteryBoxesWithDistance(currentLat, currentLon, distance, this.storeRepository, this.misteryBoxRepository, {storeId: id});
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
