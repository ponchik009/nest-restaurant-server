import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
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

  @Column()
  totalPrice: number;

  @Column()
  tableNumber: number;

  @Column({ type: 'enum', enum: OrderStatuses, default: OrderStatuses.SENT })
  status: OrderStatuses;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn()
  waiter: User;
}
