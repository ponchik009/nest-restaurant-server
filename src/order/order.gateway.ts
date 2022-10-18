import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { OrderService } from './order.service';

@WebSocketGateway(7778, { cors: true })
export class OrderGateway {
  private kitchenRoom = 'kitchen';

  constructor(private orderService: OrderService) {}

  @SubscribeMessage('joinKitchen')
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(this.kitchenRoom);
    client.to(this.kitchenRoom).emit('joinedKitchen', data);
  }

  @SubscribeMessage('createOrder')
  handleCreateOrder(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    // client.broadcast.emit('lalala', 'text');
    // client.broadcast.to()
    console.log(data);
    client.to(this.kitchenRoom).emit('orderCreated', data);
  }
}
