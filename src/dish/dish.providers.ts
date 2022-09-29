import { DataSource } from 'typeorm';
import { Dish } from './entities/dish.entity';

export const dishProviders = [
  {
    provide: 'DISH_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Dish),
    inject: ['DATA_SOURCE'],
  },
];
