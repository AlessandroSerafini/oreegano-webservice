import {Count, repository,} from '@loopback/repository';
import {
    MisteryBoxRepository,
    MisteryBoxStoreRepository,
    MisteryBoxTrackingRepository, StoreRepository,
    UserRepository, UserStoreRepository
} from '../repositories';
import {getModelSchemaRef, HttpErrors, post, Request, requestBody, RestBindings} from "@loopback/rest";
import {secured} from "../decorators/secured";
import {SecuredType, UserRoles} from "../utils/enums";
import {MisteryBox} from "../models/mistery-box.model";
import {MisteryBoxTracking} from "../models/mistery-box-tracking.model";
import {User} from "../models/user.model";
import {Store} from "../models/store.model";
import {MisteryBoxStore} from "../models/mistery-box-store.model";
import {UserStore} from "../models/user-store.model";
import {inject} from "@loopback/context";
import {environment} from "../env/environment";

interface CreateMisteryBoxBody {
    misteryBox: Omit<MisteryBox, 'id'>,
    idStore: number;
}

const jwt = require('jsonwebtoken');

export class MisteryBoxController {
    constructor(
        @inject(RestBindings.Http.REQUEST) private req: Request,
        @repository(MisteryBoxRepository) public misteryBoxRepository: MisteryBoxRepository,
        @repository(MisteryBoxStoreRepository) public misteryBoxStoreRepository: MisteryBoxStoreRepository,
        @repository(UserStoreRepository) public userStoreRepository: UserStoreRepository,
        @repository(MisteryBoxTrackingRepository) public misteryBoxTrackingRepository: MisteryBoxTrackingRepository,
        @repository(StoreRepository) public storeRepository: StoreRepository,
        @repository(UserRepository) public userRepository: UserRepository,
    ) {
    }

    @post('/mistery-boxes/create', {
        operationId: 'Create mistery box',
        responses: {
            '200': {
                description: 'MisteryBox model instance',
                content: {'application/json': {schema: getModelSchemaRef(MisteryBox)}},
            },
        },
    })
    @secured(SecuredType.HAS_ROLE, UserRoles.CUSTOMER)
    async create(
        @requestBody({
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            misteryBox: getModelSchemaRef(MisteryBox, {
                                title: 'NewMisteryBox',
                                exclude: ['id'],
                            }),
                            idStore: {
                                type: 'number',
                            },
                        },
                    },
                },
            },
        })
            data: CreateMisteryBoxBody,
    ): Promise<MisteryBox> {
        const storeCount: Count = await this.storeRepository.count({id: data.idStore});
        if (storeCount.count <= 0)
            throw new HttpErrors.NotFound('This store doesn\'t exists');
        const newMisteryBox: MisteryBox = await this.misteryBoxRepository.create(data.misteryBox);
        if (newMisteryBox.id) {
            await this.misteryBoxStoreRepository.createStoreMisteryBoxRelation(newMisteryBox.id, data.idStore);
        }
        return newMisteryBox;
    }

    @post('/mistery-boxes/buy', {
        operationId: 'Buy a mistery box',
        responses: {
            '200': {
                description: 'MisteryBoxTracking model instance',
                content: {'application/json': {schema: getModelSchemaRef(MisteryBoxTracking)}},
            },
        },
    })
    @secured(SecuredType.HAS_ROLE, UserRoles.CUSTOMER)
    async buy(
        @requestBody({
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            idMisteryBox: {
                                type: 'number',
                            },
                        },
                    },
                },
            },
        })
            data: { idMisteryBox: number },
    ): Promise<MisteryBoxTracking> {
        const {idMisteryBox} = data;
        const misteryBoxCount: Count = await this.storeRepository.count({id: idMisteryBox});
        if (misteryBoxCount.count <= 0)
            throw new HttpErrors.NotFound('This mistery box doesn\'t exists');
        const misteryBoxStoreRelation: MisteryBoxStore | null = await this.misteryBoxStoreRepository.findOne({where: {idMisteryBox}});
        const userStoreRelation: UserStore | null = await this.userStoreRepository.findOne({where: {idStore: misteryBoxStoreRelation?.idStore}});
        const idUser = jwt.verify(this.req.headers?.authorization?.split(' ')[1], environment.JWT_SECRET).idUser;
        if (userStoreRelation?.idUser === idUser)
            throw new HttpErrors.Unauthorized('You can\'t buy your mistery boxes');

        return this.misteryBoxTrackingRepository.create({
            idMisteryBox,
            idCustomer: idUser,
        });
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
