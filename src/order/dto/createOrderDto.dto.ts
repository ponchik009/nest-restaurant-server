import { Dish } from 'src/dish/entities/dish.entity';
import { OrderDish } from 'src/dish/entities/orderDish.entity';

export interface IOrderDish {
  dish: Dish;
  comment: string;
  count: number;
}

export class CreateOrderDto {
  public tableNumber: number;

  public orderDishes: IOrderDish[];
}
