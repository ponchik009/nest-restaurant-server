import { Req, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import JwtAuthenticationGuard from 'src/auth/guard/jwt.guard';
import RequestWithUser from 'src/auth/interface/requestWithUser.interface';
import { User } from 'src/user/entities/user.entity';
import { CreateOrderDto } from './dto/createOrderDto.dto';
import { OrderService } from './order.service';

@WebSocketGateway(7778, { cookie: true })
export class OrderGateway {
  private kitchenRoom = 'kitchen';

  constructor(private orderService: OrderService) {}

  @SubscribeMessage('joinKitchen')
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
    @Req() request: RequestWithUser,
  ) {
    client.join(this.kitchenRoom);
    client.to(this.kitchenRoom).emit('joinedKitchen', data);
  }

  // @UseGuards(JwtAuthenticationGuard)
  @SubscribeMessage('createOrder')
  async handleCreateOrder(
    @MessageBody() data: [CreateOrderDto, User],
    @ConnectedSocket() client: Socket,
    @Req() request: RequestWithUser,
  ) {
    console.log(data);
    const order = await this.orderService.create(data[0], data[1]);
    client.to(this.kitchenRoom).emit('orderCreated', order);
  }

  @SubscribeMessage('startCooking')
  async handleStartCooking(
    @MessageBody() data: number,
    @ConnectedSocket() client: Socket,
    @Req() request: RequestWithUser,
  ) {
    console.log(data);
    const updatedOrderDish = await this.orderService.startCooking(data);
    client.to(this.kitchenRoom).emit('startedCooking', updatedOrderDish);
    client.emit('startedCooking', updatedOrderDish);
  }

  @SubscribeMessage('endCooking')
  async handleEndCooking(
    @MessageBody() data: number,
    @ConnectedSocket() client: Socket,
    @Req() request: RequestWithUser,
  ) {
    console.log(data);
    const updatedOrderDish = await this.orderService.endCooking(data);
    client.to(this.kitchenRoom).emit('endedCooking', updatedOrderDish);
    client.emit('endedCooking', updatedOrderDish);
  }
}
