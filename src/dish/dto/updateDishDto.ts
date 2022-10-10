import { DishTypes } from '../entities/dish.entity';

export class UpdateDishDto {
  name?: string;

  description?: string;

  ingredients?: string;

  price?: number;

  image?: string;

  weight?: number;

  calories?: number;

  cookingTime?: number;

  isVegan?: boolean;

  isAlcoholic?: boolean;

  dishType?: DishTypes;
}
