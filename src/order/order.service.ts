import { Inject, Injectable } from '@nestjs/common';
import { Dish } from 'src/dish/entities/dish.entity';
import {
  OrderDish,
  OrderDishStatuses,
} from 'src/dish/entities/orderDish.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { In, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/createOrderDto.dto';
import { Order, OrderStatuses } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @Inject('ORDER_REPOSITORY')
    private orderRepo: Repository<Order>,
    @Inject('ORDER_DISHES_REPOSITORY')
    private orderDishesRepo: Repository<OrderDish>,
    @Inject('DISH_REPOSITORY')
    private dishRepo: Repository<Dish>,
  ) {}

  async getAll() {
    return await this.orderRepo.find({
      relations: ['orderDishes', 'orderDishes.dish'],
    });
  }

  async getForKitchen() {
    return await this.orderRepo.find({
      where: [
        {
          status: OrderStatuses.SENT,
        },
        {
          status: OrderStatuses.COOKING,
        },
      ],
      relations: ['orderDishes', 'orderDishes.dish'],
      order: {
        date: 'DESC',
      },
    });
  }

  async startCooking(orderDishId: number) {
    const orderDish = await this.orderDishesRepo.findOne({
      where: { id: orderDishId },
      relations: { order: true },
    });
    const order = await this.orderRepo.findOne({
      where: {
        id: orderDish.order.id,
      },
      relations: {
        orderDishes: true,
      },
    });

    const promise = this.orderDishesRepo.update(orderDishId, {
      orderDishStatus: OrderDishStatuses.COOKING,
    });

    this.orderRepo.update(order.id, {
      status: OrderStatuses.COOKING,
    });

    return promise.then(() =>
      this.orderDishesRepo.findOne({
        where: { id: orderDishId },
        relations: { order: true },
      }),
    );
  }

  async endCooking(orderDishId: number) {
    const orderDish = await this.orderDishesRepo.findOne({
      where: { id: orderDishId },
      relations: { order: true },
    });
    const order = await this.orderRepo.findOne({
      where: {
        id: orderDish.order.id,
      },
      relations: {
        orderDishes: true,
      },
    });

    const promise = this.orderDishesRepo.update(orderDishId, {
      orderDishStatus: OrderDishStatuses.READY,
    });

    if (
      !order.orderDishes.some(
        (d) =>
          d.id !== orderDish.id && d.orderDishStatus === OrderDishStatuses.SENT,
      )
    ) {
      await this.orderRepo.update(order.id, {
        status: OrderStatuses.READY,
      });
    }

    return promise.then(() =>
      this.orderDishesRepo.findOne({
        where: { id: orderDishId },
        relations: { order: true },
      }),
    );
  }

  async getByWaiter(waiter: User) {
    return await this.orderRepo.find({
      where: {
        waiter: {
          id: waiter.id,
        },
      },
      relations: ['orderDishes', 'orderDishes.dish'],
    });
  }

  async create(dto: CreateOrderDto, waiter: User) {
    const totalCount = dto.orderDishes.reduce(
      (prev, cur) => prev + cur.count * cur.dish.price,
      0,
    );

    const order = await this.orderRepo.save({
      tableNumber: dto.tableNumber,
      totalPrice: totalCount,
      date: new Date(Date.now()),
      waiter,
    });

    const orderDishesEntities = dto.orderDishes.map((orderDish) => ({
      dish: {
        id: orderDish.dish.id,
      },
      order: {
        id: order.id,
      },
      comment: orderDish.comment || null,
      count: orderDish.count || 1,
    }));
    await this.orderDishesRepo.save(orderDishesEntities);

    return this.orderRepo.findOne({
      where: { id: order.id },
      relations: ['orderDishes', 'orderDishes.dish'],
    });
  }
}
