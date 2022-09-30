import { Inject, Injectable } from '@nestjs/common';
import { Dish } from 'src/dish/entities/dish.entity';
import { OrderDish } from 'src/dish/entities/orderDish.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { In, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/createOrderDto.dto';
import { Order } from './entities/order.entity';

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
    const dishesIds = dto.orderDishes.map((orderDish) => orderDish.dishId);
    const dishes = await this.dishRepo.find({
      where: {
        id: In(dishesIds),
      },
    });

    // зато за О(n)
    const countOfDishes = new Map();
    dto.orderDishes.forEach((orderDish) =>
      countOfDishes.set(orderDish.dishId, orderDish.count || 1),
    );
    const totalCount = dishes.reduce(
      (acc, value) => acc + value.price * countOfDishes.get(value.id),
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
        id: orderDish.dishId,
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
