import { OrderDish } from 'src/dish/entities/orderDish.entity';

export interface IOrderDish {
  dishId: number;
  comment: string;
  count: number;
}

export class CreateOrderDto {
  public tableNumber: number;

  public orderDishes: IOrderDish[];
}
