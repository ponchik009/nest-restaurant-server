import { DishTypes } from '../entities/dish.entity';

export class CreateDishDto {
  name: string;

  description?: string;

  ingredients?: string;

  price: number;

  image?: string;

  weight?: number;

  calories?: number;

  isVegan?: boolean;

  isAlcoholic?: boolean;

  dishType: DishTypes;
}
