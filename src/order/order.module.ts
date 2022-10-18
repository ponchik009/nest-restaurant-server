import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserModule } from '../user/user.module';
import { OrderController } from './order.controller';
import { OrderGateway } from './order.gateway';
import { orderProviders } from './order.providers';
import { OrderService } from './order.service';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [OrderController],
  providers: [OrderService, ...orderProviders, OrderGateway],
})
export class OrderModule {}
