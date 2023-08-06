/* eslint-disable @typescript-eslint/no-unused-vars */
/*
https://docs.nestjs.com/websockets/gateways#gateways
*/
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WSData } from '@org/models';
import { Server, WebSocket } from 'ws';
import { PollingService } from './polling.service';
import { map, startWith } from 'rxjs';
@WebSocketGateway()
export class PollingGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private readonly pollingClient: PollingService) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('polling')
  handlePolling(
    @MessageBody() data: number,
    @ConnectedSocket() client: WebSocket
  ) {
    console.log('Polling with threshold ', data);
    return this.pollingClient.poll(data).pipe(
      map((data) => ({ event: 'polling_completed', data })),
      startWith({ event: 'polling', data: 'Processing request ⏲️️' })
    );

    //    this.pollingClient.poll(data).subscribe((data) => {
    //      client.send(JSON.stringify({ event: 'polling_completed', data }));
    //    });
    //    const event = 'polling';
    //    return { event, data: 'Processing request' };
  }
  handleConnection() {
    console.log('User connected');
  }

  handleDisconnect() {
    console.log('User disconnected');
  }

  afterInit() {
    console.log('Socket is live');
  }

  broadCast<T>(data: WSData<T>) {
    this.server.clients.forEach((client) => {
      client.send(JSON.stringify(data));
    });
  }
}
