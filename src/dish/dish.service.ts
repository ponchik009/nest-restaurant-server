import { Inject, Injectable } from '@nestjs/common';
import { FileService } from 'src/file/file.service';
import { Repository } from 'typeorm';
import { CreateDishDto } from './dto/createDishDto.dto';
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

  async create(dto: CreateDishDto, file: any) {
    const filepath = file ? await this.fileService.createFile(file) : null;

    return await this.dishRepo.save({
      ...dto,
      image: filepath,
    });
  }
}
