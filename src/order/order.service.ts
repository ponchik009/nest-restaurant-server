import { Inject, Injectable } from '@nestjs/common';
import { Dish } from 'src/dish/entities/dish.entity';
import {
  OrderDish,
  OrderDishStatuses,
} from 'src/dish/entities/orderDish.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Between, In, MoreThanOrEqual, Repository } from 'typeorm';
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
        relations: ['order', 'order.waiter'],
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
          d.id !== orderDish.id &&
          d.orderDishStatus !== OrderDishStatuses.READY,
      )
    ) {
      await this.orderRepo.update(order.id, {
        status: OrderStatuses.READY,
      });
    }

    return promise.then(() =>
      this.orderDishesRepo.findOne({
        where: { id: orderDishId },
        relations: ['order', 'order.waiter'],
      }),
    );
  }

  async deliverDish(orderDishId: number) {
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
      orderDishStatus: OrderDishStatuses.DELIVERED,
    });

    if (
      !order.orderDishes.some(
        (d) =>
          d.id !== orderDish.id &&
          d.orderDishStatus !== OrderDishStatuses.DELIVERED,
      )
    ) {
      await this.orderRepo.update(order.id, {
        status: OrderStatuses.DELIVERED,
      });
    }

    return promise.then(() =>
      this.orderDishesRepo.findOne({
        where: { id: orderDishId },
        relations: ['order', 'order.waiter'],
      }),
    );
  }

  async changePayStatus(orderId: number) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
    });

    await this.orderRepo.update(orderId, { isPaid: !order.isPaid });

    return await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['orderDishes', 'waiter', 'orderDishes.dish'],
    });
  }

  async getByWaiter(waiter: User) {
    return await this.orderRepo.find({
      where: {
        waiter: {
          id: waiter.id,
        },
      },
      relations: ['orderDishes', 'orderDishes.dish'],
      order: {
        date: 'DESC',
      },
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
      relations: ['orderDishes', 'orderDishes.dish', 'waiter'],
    });
  }

  async getReportByDishes(dateStart: Date, dateEnd: Date, dishIds: number[]) {
    let orders = await this.orderRepo.find({
      where: {
        date: dateStart && dateEnd && Between(dateStart, dateEnd),
      },
      relations: ['orderDishes', 'orderDishes.dish', 'waiter'],
    });

    const dishes = await this.dishRepo.find({
      where: {
        id: In(dishIds),
      },
    });

    let result = dishes.reduce(
      (prev: Object, curr: Dish) => ({
        ...prev,
        [curr.id]: {
          id: curr.id,
          name: curr.name,
          currentPrice: curr.price,
          inOrders: 0,
          count: 0,
          totalPrice: 0,
        },
      }),
      {},
    );

    for (let order of orders) {
      for (let dish of order.orderDishes) {
        let id = dish.dish.id;
        if (result[id]) {
          result[id].count += dish.count;
          // тут есть проблема: если цена меняется во времени, то считать мы будем неправильно :(
          result[id].totalPrice += dish.count * dish.dish.price;
          result[id].inOrders += 1;
        }
      }
    }

    for (let key of Object.keys(result)) {
      result[key].percent = Math.floor(
        (result[key].inOrders / orders.length) * 100,
      );
    }

    return Object.values(result);
  }
}
