import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/guard/jwt.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import RequestWithUser from 'src/auth/interface/requestWithUser.interface';
import { Roles } from 'src/auth/role.decorator';
import { KITCHEN, MANAGER, WAITER } from 'src/const/roles';
import { CreateOrderDto } from './dto/createOrderDto.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Roles(MANAGER)
  @Get()
  async getAll() {
    return this.orderService.getAll();
  }

  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Roles(WAITER)
  @Get('by_waiter')
  async getByWaiter(@Req() request: RequestWithUser) {
    return this.orderService.getByWaiter(request.user);
  }

  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Roles(KITCHEN)
  @Get('for_kitchen')
  async getForKitchen() {
    return this.orderService.getForKitchen();
  }

  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Roles(WAITER)
  @Post()
  async create(@Req() request: RequestWithUser, @Body() dto: CreateOrderDto) {
    const waiter = request.user;

    return this.orderService.create(dto, waiter);
  }

  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Roles(MANAGER)
  @Get('/reportByDishes')
  async getReportByDishes(
    @Query('date_start') dateStart: Date,
    @Query('date_end') dateEnd: Date,
    @Query('dish_ids') dishIds: string = '',
  ) {
    return this.orderService.getReportByDishes(
      dateStart,
      dateEnd,
      dishIds.split(',').map(Number),
    );
  }
}
