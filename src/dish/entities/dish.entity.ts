import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

export enum DishTypes {
  SNACK = 'snack',
  SALAD = 'salad',
  SOUP = 'soup',
  HOTTER = 'hotter',
  DRINK = 'drink',
}

@Entity()
export class Dish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  ingredients: string;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false, default: 0 })
  cookingTime: number;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  weight: number;

  @Column({ nullable: true })
  calories: number;

  @Column({ nullable: true })
  isVegan: boolean;

  @Column({ nullable: true })
  isAlcoholic: boolean;

  @Column({ type: 'enum', enum: DishTypes, nullable: false })
  dishType: DishTypes;
}
