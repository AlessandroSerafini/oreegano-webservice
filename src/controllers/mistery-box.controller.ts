import {repository,} from '@loopback/repository';
import {MisteryBoxRepository, StoreRepository, UserRepository,} from '../repositories';
import {MisteryBox} from "../models/mistery-box.model";
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {secured} from "../decorators/secured";
import {SecuredType, UserRoles} from "../utils/enums";
import moment = require("moment");

interface CreateMisteryBoxBody {
    misteryBox: Omit<MisteryBox, 'id'>,
    idStore: number;
}


export class MisteryBoxController {
    constructor(
        @repository(MisteryBoxRepository) public misteryBoxRepository: MisteryBoxRepository,
        @repository(StoreRepository) public storeRepository: StoreRepository,
        @repository(UserRepository) public userRepository: UserRepository,
    ) {
    }

    @get('/mistery-boxes/near-me', {
        operationId: 'Mistery boxes near me',
        responses: {
            '200': {
                description: 'Array of Mistery Box model instances',
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
    async findNearMe(
        @param.query.number('lat') currentLat,
        @param.query.number('lon') currentLon,
        @param.query.number('distance') distance,
    ): Promise<any[]> {
        let res: any[] = [];
        const nearMeQuery = `SELECT id, SQRT( POW(69.1 * (lat - ${currentLat}), 2) + POW(69.1 * (${currentLon} - lon) * COS(lat / 57.3), 2)) AS distance FROM Store HAVING distance < ${distance} ORDER BY distance`;
        const nearMeStoresIds: any[] = await this.storeRepository.dataSource.execute(nearMeQuery);
        const misteryBoxStoreFilter: any[] = [];
        if (nearMeStoresIds.length > 0) {
            nearMeStoresIds.forEach((store) => {
                misteryBoxStoreFilter.push({storeId: store.id});
            });

            res = await this.misteryBoxRepository.find({
                include: [{relation: "store"}],
                where: {
                    and: [
                        {or: misteryBoxStoreFilter},
                        {available: {gt: 1}},
                        {date: {gte: moment().startOf('day').toDate()}}
                    ],
                }
            });

            console.log(moment().startOf('day').toDate());

            res = JSON.parse(JSON.stringify(res));
            if (res && res.length > 0) {
                res.forEach((box) => {
                    box.distance = nearMeStoresIds.find(x => x.id === box.storeId).distance;
                });
            }
        }
        return res;
    }


    @get('/mistery-boxes/latest', {
        operationId: 'Latest Mistery boxes',
        responses: {
            '200': {
                description: 'Array of MisteryBox model instances',
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
    @secured(SecuredType.HAS_ROLE, UserRoles.CUSTOMER)
    async findLatest(): Promise<MisteryBox[]> {

        const res: MisteryBox[] = await this.misteryBoxRepository.find({
            include: [{relation: "store"}],
            where: {
                and: [
                    {available: {gt: 1, lte: 4}},
                    {date: {gte: moment().startOf('day').toDate()}}
                ],
            }
        });
        return res;
    }


    @get('/mistery-boxes/sold-out', {
        operationId: 'Sold out Mistery boxes',
        responses: {
            '200': {
                description: 'Array of MisteryBox model instances',
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
    @secured(SecuredType.HAS_ROLE, UserRoles.CUSTOMER)
    async findSoldOut(): Promise<MisteryBox[]> {
        const res: MisteryBox[] = await this.misteryBoxRepository.find({
            include: [{relation: "store"}],
            where: {
                and: [
                    {available: 0,},
                    {date: {gte: moment().startOf('day').toDate()}}
                ],
            }
        });
        return res;
    }

    /*@post('/mistery-boxes', {
      responses: {
        '200': {
          description: 'MisteryBox model instance',
          content: {'application/json': {schema: getModelSchemaRef(MisteryBox)}},
        },
      },
    })
    async create(
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(MisteryBox, {
              title: 'NewMisteryBox',
              exclude: ['id'],
            }),
          },
        },
      })
      misteryBox: Omit<MisteryBox, 'id'>,
    ): Promise<MisteryBox> {
      return this.misteryBoxRepository.create(misteryBox);
    }*/

    /*get('/mistery-boxes/count', {
      responses: {
        '200': {
          description: 'MisteryBox model count',
          content: {'application/json': {schema: CountSchema}},
        },
      },
    })
    async count(
      @param.where(MisteryBox) where?: Where<MisteryBox>,
    ): Promise<Count> {
      return this.misteryBoxRepository.count(where);
    }*/

    /*@get('/mistery-boxes', {
      responses: {
        '200': {
          description: 'Array of MisteryBox model instances',
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
    async find(
      @param.filter(MisteryBox) filter?: Filter<MisteryBox>,
    ): Promise<MisteryBox[]> {
      return this.misteryBoxRepository.find(filter);
    }*/

    /*@patch('/mistery-boxes', {
      responses: {
        '200': {
          description: 'MisteryBox PATCH success count',
          content: {'application/json': {schema: CountSchema}},
        },
      },
    })
    async updateAll(
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(MisteryBox, {partial: true}),
          },
        },
      })
      misteryBox: MisteryBox,
      @param.where(MisteryBox) where?: Where<MisteryBox>,
    ): Promise<Count> {
      return this.misteryBoxRepository.updateAll(misteryBox, where);
    }*/

    /*@get('/mistery-boxes/{id}', {
      responses: {
        '200': {
          description: 'MisteryBox model instance',
          content: {
            'application/json': {
              schema: getModelSchemaRef(MisteryBox, {includeRelations: true}),
            },
          },
        },
      },
    })
    async findById(
      @param.path.number('id') id: number,
      @param.filter(MisteryBox, {exclude: 'where'}) filter?: FilterExcludingWhere<MisteryBox>
    ): Promise<MisteryBox> {
      return this.misteryBoxRepository.findById(id, filter);
    }*/

    /*@patch('/mistery-boxes/{id}', {
      responses: {
        '204': {
          description: 'MisteryBox PATCH success',
        },
      },
    })
    async updateById(
      @param.path.number('id') id: number,
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(MisteryBox, {partial: true}),
          },
        },
      })
      misteryBox: MisteryBox,
    ): Promise<void> {
      await this.misteryBoxRepository.updateById(id, misteryBox);
    }*/

    /*@put('/mistery-boxes/{id}', {
      responses: {
        '204': {
          description: 'MisteryBox PUT success',
        },
      },
    })
    async replaceById(
      @param.path.number('id') id: number,
      @requestBody() misteryBox: MisteryBox,
    ): Promise<void> {
      await this.misteryBoxRepository.replaceById(id, misteryBox);
    }*/

    /*@del('/mistery-boxes/{id}', {
      responses: {
        '204': {
          description: 'MisteryBox DELETE success',
        },
      },
    })
    async deleteById(@param.path.number('id') id: number): Promise<void> {
      await this.misteryBoxRepository.deleteById(id);
    }*/
}
