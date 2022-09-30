import { Dish } from 'src/dish/entities/dish.entity';
import { OrderDish } from 'src/dish/entities/orderDish.entity';
import { DataSource } from 'typeorm';
import { Order } from './entities/order.entity';

export const orderProviders = [
  {
    provide: 'ORDER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Order),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ORDER_DISHES_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(OrderDish),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'DISH_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Dish),
    inject: ['DATA_SOURCE'],
  },
];
