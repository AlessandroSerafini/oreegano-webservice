import {repository,} from '@loopback/repository';
import {MisteryBoxRepository, StoreRepository, UserRepository,} from '../repositories';
import {MisteryBox} from "../models/mistery-box.model";

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
