import {
    Count,
    CountSchema,
    Filter,
    repository,
    Where,
} from '@loopback/repository';
import {
    del,
    get,
    getModelSchemaRef,
    getWhereSchemaFor, HttpErrors,
    param,
    patch,
    post,
    requestBody,
} from '@loopback/rest';
import {
    User,
    Order, Address, MisteryBox,
} from '../models';
import {MisteryBoxRepository, OrderRepository, UserRepository} from '../repositories';
import {secured} from "../decorators/secured";
import {SecuredType, UserRoles} from "../utils/enums";

export class UserOrderController {
    constructor(
        @repository(UserRepository) protected userRepository: UserRepository,
        @repository(MisteryBoxRepository) protected misteryBoxRepository: MisteryBoxRepository,
        @repository(OrderRepository) protected orderRepository: OrderRepository,
    ) {
    }

    /*@get('/users/{id}/orders', {
      responses: {
        '200': {
          description: 'Array of User has many Order',
          content: {
            'application/json': {
              schema: {type: 'array', items: getModelSchemaRef(Order)},
            },
          },
        },
      },
    })
    async find(
      @param.path.number('id') id: number,
      @param.query.object('filter') filter?: Filter<Order>,
    ): Promise<Order[]> {
      return this.userRepository.orders(id).find(filter);
    }*/

    @post('/users/{id}/orders', {
        operationId: 'Create user order',
        responses: {
            '200': {
                description: 'User model instance',
                content: {'application/json': {schema: getModelSchemaRef(Order)}},
            },
        },
    })
    @secured(SecuredType.HAS_ROLE, UserRoles.CUSTOMER)
    async create(
        @param.path.number('id') id: typeof User.prototype.id,
        @requestBody({
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            order: getModelSchemaRef(Order, {
                                title: 'NewOrderInUser',
                                exclude: ['id'],
                                optional: ['userId']
                            }),
                            idBox: {type: 'number'},
                        },
                    },
                },
            },
        }) data: { order: Omit<Order, 'id'>, idBox: number }
    ): Promise<Order> {
        const box: MisteryBox = await this.misteryBoxRepository.findById(data.idBox);

        await this.misteryBoxRepository.updateById(data.idBox, {available: box.available - 1});
        return this.userRepository.orders(id).create(data.order);
    }

    /*@patch('/users/{id}/orders', {
      responses: {
        '200': {
          description: 'User.Order PATCH success count',
          content: {'application/json': {schema: CountSchema}},
        },
      },
    })
    async patch(
      @param.path.number('id') id: number,
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(Order, {partial: true}),
          },
        },
      })
      order: Partial<Order>,
      @param.query.object('where', getWhereSchemaFor(Order)) where?: Where<Order>,
    ): Promise<Count> {
      return this.userRepository.orders(id).patch(order, where);
    }

    @del('/users/{id}/orders', {
      responses: {
        '200': {
          description: 'User.Order DELETE success count',
          content: {'application/json': {schema: CountSchema}},
        },
      },
    })
    async delete(
      @param.path.number('id') id: number,
      @param.query.object('where', getWhereSchemaFor(Order)) where?: Where<Order>,
    ): Promise<Count> {
      return this.userRepository.orders(id).delete(where);
    }*/
}
