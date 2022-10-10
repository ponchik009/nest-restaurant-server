import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FileService } from 'src/file/file.service';
import { Repository } from 'typeorm';
import { CreateDishDto } from './dto/createDishDto.dto';
import { UpdateDishDto } from './dto/updateDishDto';
import { Dish } from './entities/dish.entity';

@Injectable()
export class DishService {
  constructor(
    @Inject('DISH_REPOSITORY')
    private dishRepo: Repository<Dish>,
    private fileService: FileService,
  ) {}

  async getAll() {
    return await this.dishRepo.find();
  }

  async getById(id: number) {
    return await this.dishRepo.findOne({ where: { id } });
  }

  async create(dto: CreateDishDto, file: any) {
    const filepath = file ? await this.fileService.createFile(file) : null;

    console.log(dto);

    return await this.dishRepo.save({
      ...dto,
      image: filepath,
    });
  }

  async update(id: number, dto: UpdateDishDto, file: any) {
    const dish = await this.dishRepo.findOne({
      where: { id },
    });

    console.log(dto);

    const filepath = file
      ? await this.fileService.createFile(file)
      : dish.image;

    if (!dish) {
      throw new HttpException('Блюдо не найдено!', HttpStatus.NOT_FOUND);
    }

    return await this.dishRepo.save({
      ...dish,
      isAlcoholic: String(dto?.isAlcoholic) === 'true' ? true : false,
      isVegan: String(dto?.isVegan) === 'true' ? true : false,
      image: filepath,
    });
  }
}
