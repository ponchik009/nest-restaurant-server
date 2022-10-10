import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import JwtAuthenticationGuard from 'src/auth/guard/jwt.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { MANAGER, WAITER } from 'src/const/roles';
import { DishService } from './dish.service';
import { CreateDishDto } from './dto/createDishDto.dto';
import { UpdateDishDto } from './dto/updateDishDto';

@Controller('dish')
export class DishController {
  constructor(private dishService: DishService) {}

  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Roles(MANAGER, WAITER)
  @Get()
  async getAll() {
    return this.dishService.getAll();
  }

  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Roles(MANAGER, WAITER)
  @Get(':id')
  async getOne(@Param('id') id: number) {
    return this.dishService.getById(id);
  }

  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Roles(MANAGER)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async create(@Body() dto: CreateDishDto, @UploadedFile() file) {
    return this.dishService.create(dto, file);
  }

  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Roles(MANAGER)
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateDishDto,
    @UploadedFile() file,
  ) {
    return this.dishService.update(id, dto, file);
  }
}
