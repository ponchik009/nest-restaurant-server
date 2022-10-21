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
    client.emit('orderCreated', order);
  }

  @SubscribeMessage('startCooking')
  async handleStartCooking(
    @MessageBody() orderDishId: number,
    @ConnectedSocket() client: Socket,
    @Req() request: RequestWithUser,
  ) {
    console.log(orderDishId);
    const updatedOrderDish = await this.orderService.startCooking(orderDishId);
    client.to(this.kitchenRoom).emit('startedCooking', updatedOrderDish);
    client.emit('startedCooking', updatedOrderDish);
  }

  @SubscribeMessage('endCooking')
  async handleEndCooking(
    @MessageBody() orderDishId: number,
    @ConnectedSocket() client: Socket,
    @Req() request: RequestWithUser,
  ) {
    console.log(orderDishId);
    const updatedOrderDish = await this.orderService.endCooking(orderDishId);
    client.to(this.kitchenRoom).emit('endedCooking', updatedOrderDish);
    client.emit('endedCooking', updatedOrderDish);
  }

  @SubscribeMessage('deliverDish')
  async handleDeliverDish(
    @MessageBody() orderDishId: number,
    @ConnectedSocket() client: Socket,
    @Req() request: RequestWithUser,
  ) {
    console.log(orderDishId);
    const updatedOrderDish = await this.orderService.deliverDish(orderDishId);
    client.to(this.kitchenRoom).emit('deliveredDish', updatedOrderDish);
    client.emit('deliveredDish', updatedOrderDish);
  }

  @SubscribeMessage('payOrder')
  async handlePayOrder(
    @MessageBody() orderId: number,
    @ConnectedSocket() client: Socket,
    @Req() request: RequestWithUser,
  ) {
    console.log(orderId);
    const updatedOrder = await this.orderService.changePayStatus(orderId);
    client.to(this.kitchenRoom).emit('paidOrder', updatedOrder);
    client.emit('paidOrder', updatedOrder);
  }
}
