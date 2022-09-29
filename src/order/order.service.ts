import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/createOrderDto.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @Inject('ORDER_REPOSITORY')
    private orderRepo: Repository<Order>,
    private userService: UserService,
  ) {}

  async getAll() {
    return await this.orderRepo.find();
  }

  async getByWaiter(waiter: User) {
    return await this.orderRepo.find({
      where: {
        waiter: {
          id: waiter.id,
        },
      },
    });
  }

  async create(dto: CreateOrderDto, waiter: User) {
    return await this.orderRepo.save({
      ...dto,
      date: new Date(dto.date),
      waiter,
    });
  }
}
