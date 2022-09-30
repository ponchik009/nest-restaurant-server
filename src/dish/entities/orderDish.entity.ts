import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Dish } from './dish.entity';

export enum OrderDishStatuses {
  SENT = 'sent',
  COOKING = 'cooking',
  READY = 'ready',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
}

@Entity()
export class OrderDish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: OrderDishStatuses,
    default: OrderDishStatuses.SENT,
  })
  orderDishStatus: OrderDishStatuses;

  @Column({
    nullable: true,
  })
  comment: string | null;

  @Column({
    nullable: false,
    default: 1,
  })
  count: number;

  @ManyToOne(() => Dish)
  @JoinColumn()
  dish: Dish;

  @ManyToOne(() => Order)
  @JoinColumn()
  order: Order;
}
