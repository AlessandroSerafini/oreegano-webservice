import {Count, CountSchema, FilterExcludingWhere, repository, Where,} from '@loopback/repository';
import {get, getModelSchemaRef, HttpErrors, param, patch, requestBody,} from '@loopback/rest';
import {Order} from '../models';
import {OrderRepository} from '../repositories';
import {secured} from "../decorators/secured";
import {SecuredType, UserRoles} from "../utils/enums";
import {getNearQuery} from "../utils/query";
import {SocketService} from "../services/socket.service";
import {inject} from "@loopback/context";

export class OrderController {
    constructor(
        @repository(OrderRepository) public orderRepository: OrderRepository,
        @inject('services.SocketService') private socketService: SocketService,
    ) {
    }

    @get('/orders/count', {
        responses: {
            '200': {
                description: 'Order model count',
                content: {'application/json': {schema: CountSchema}},
            },
        },
    })
    async count(
        @param.where(Order) where?: Where<Order>,
    ): Promise<Count> {
        return this.orderRepository.count(where);
    }

    @get('/orders/runner/near', {
        operationId: 'Orders not yet taken over, close to the runner\'s position',
        responses: {
            '200': {
                description: 'Array of Order model instances',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: getModelSchemaRef(Order, {includeRelations: true}),
                        },
                    },
                },
            },
        },
    })
    @secured(SecuredType.HAS_ROLE, UserRoles.DELIVERY)
    async findNearMe(
        @param.query.number('lat') currentLat,
        @param.query.number('lon') currentLon,
        @param.query.number('distance') distance,
    ): Promise<any[]> {
        return this.orderRepository.dataSource.execute(getNearQuery("*", "storeLat", "storeLon", currentLat, currentLon, "Order", `WHERE runner IS NULL HAVING distance < ${distance}`, "distance", "ASC"));
    }

    @get('/orders/runner/latest', {
        operationId: 'Orders not yet taken over, order by newer',
        responses: {
            '200': {
                description: 'Array of Order model instances',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: getModelSchemaRef(Order, {includeRelations: true}),
                        },
                    },
                },
            },
        },
    })
    @secured(SecuredType.HAS_ROLE, UserRoles.DELIVERY)
    async findLatest(
        @param.query.number('lat') currentLat,
        @param.query.number('lon') currentLon,
    ): Promise<any[]> {
        return this.orderRepository.dataSource.execute(getNearQuery("*", "storeLat", "storeLon", currentLat, currentLon, "Order", "WHERE runner IS NULL", "date", "DESC"));
    }

    /*@patch('/orders', {
      responses: {
        '200': {
          description: 'Order PATCH success count',
          content: {'application/json': {schema: CountSchema}},
        },
      },
    })
    async updateAll(
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(Order, {partial: true}),
          },
        },
      })
      order: Order,
      @param.where(Order) where?: Where<Order>,
    ): Promise<Count> {
      return this.orderRepository.updateAll(order, where);
    }

    @get('/orders/{id}', {
      responses: {
        '200': {
          description: 'Order model instance',
          content: {
            'application/json': {
              schema: getModelSchemaRef(Order, {includeRelations: true}),
            },
          },
        },
      },
    })
    async findById(
      @param.path.number('id') id: number,
      @param.filter(Order, {exclude: 'where'}) filter?: FilterExcludingWhere<Order>
    ): Promise<Order> {
      return this.orderRepository.findById(id, filter);
    }*/

    @patch('/orders/{id}', {
        responses: {
            '204': {
                description: 'Order PATCH success',
            },
        },
    })
    @secured(SecuredType.HAS_ROLE, UserRoles.DELIVERY)
    async updateById(
        @param.path.number('id') id: number,
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(Order, {partial: true}),
                },
            },
        })
            order: Order,
    ): Promise<void> {
        const o: Order = await this.orderRepository.findById(id);

        if (o.runner) {
            throw new HttpErrors.BadRequest('This order is already taken');
        }

        await this.orderRepository.updateById(id, order);
    }

    @patch('/orders/{id}/update-runner-position', {
        responses: {
            '204': {
                description: 'Order PATCH success',
            },
        },
    })
    @secured(SecuredType.HAS_ROLE, UserRoles.DELIVERY)
    async updateRunnerPosition(
        @param.path.number('id') id: number,
        @requestBody({
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            position: {
                                latitude: {type: 'number'},
                                longitude: {type: 'number'}
                            },
                        },
                    },
                },
            },
        })
            data: {
            position: {
                latitude: { type: 'number' },
                longitude: { type: 'number' }
            },
            idRunner: number,
        },
    ): Promise<void> {
        return this.socketService.updateLocation(id, data.position, data.idRunner);
    }

    @get('/orders/{id}', {
        responses: {
            '200': {
                description: 'Order model instance',
                content: {
                    'application/json': {
                        schema: getModelSchemaRef(Order, {includeRelations: true}),
                    },
                },
            },
        },
    })
    @secured(SecuredType.IS_AUTHENTICATED)
    async findById(
        @param.path.number('id') id: number,
        @param.filter(Order, {exclude: 'where'}) filter?: FilterExcludingWhere<Order>
    ): Promise<Order> {
        return this.orderRepository.findById(id, filter);
    }

    /*@put('/orders/{id}', {
      responses: {
        '204': {
          description: 'Order PUT success',
        },
      },
    })
    async replaceById(
      @param.path.number('id') id: number,
      @requestBody() order: Order,
    ): Promise<void> {
      await this.orderRepository.replaceById(id, order);
    }

    @del('/orders/{id}', {
      responses: {
        '204': {
          description: 'Order DELETE success',
        },
      },
    })
    async deleteById(@param.path.number('id') id: number): Promise<void> {
      await this.orderRepository.deleteById(id);
    }*/
}
