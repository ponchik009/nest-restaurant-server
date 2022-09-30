import { OrderDish } from 'src/dish/entities/orderDish.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

export enum OrderStatuses {
  SENT = 'sent',
  COOKING = 'cooking',
  READY = 'ready',
  DELIVERED = 'delivered',
  PAID = 'paid',
  CANCELED = 'canceled',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column({ nullable: true })
  totalPrice: number;

  @Column()
  tableNumber: number;

  @Column({ type: 'enum', enum: OrderStatuses, default: OrderStatuses.SENT })
  status: OrderStatuses;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn()
  waiter: User;

  @OneToMany(() => OrderDish, (orderDish) => orderDish.order)
  orderDishes: OrderDish[];
}
