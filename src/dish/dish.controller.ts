import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import JwtAuthenticationGuard from 'src/auth/guard/jwt.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { MANAGER } from 'src/const/roles';
import { DishService } from './dish.service';
import { CreateDishDto } from './dto/createDishDto.dto';

@Controller('dish')
export class DishController {
  constructor(private dishService: DishService) {}

  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Roles(MANAGER)
  @Get()
  async getAll() {
    return this.dishService.getAll();
  }

  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Roles(MANAGER)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async create(@Body() dto: CreateDishDto, @UploadedFile() file) {
    return this.dishService.create(dto, file);
  }
}
