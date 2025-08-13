// src/app.gateway.ts
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FinishStudySessionUseCase } from './use-cases/finish-study-session.usecase';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: ['*'],
    credentials: true,
  },
})
export class CounterGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly finishStudySessionUseCase: FinishStudySessionUseCase,
    private readonly logger: Logger,
  ) {}

  @WebSocketServer()
  server: Server;

  private clientTimers: Map<string, NodeJS.Timeout> = new Map();
  private connectionDurations: Map<string, number> = new Map();
  private clientStartDates: Map<string, number> = new Map();

  handleConnection(client: Socket) {
    try {
      const clientId = client.id;
      this.logConnection(client);

      this.initClientData(clientId);
      this.startTimer(client, clientId);
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const clientId = client.id;
      this.logDisconnection(client);

      this.clearTimer(clientId);

      const startDate = this.clientStartDates.get(clientId);
      if (startDate) {
        const endDate = Date.now();
        await this.finishStudySessionUseCase.execute({
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          userId: String(client.handshake.query?.userId),
          subjectId: String(client.handshake.query?.subjectId),
        });
      }

      this.clearClientData(clientId);
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  private logConnection(client: Socket) {
    const { userId, subjectId, token } = client.handshake.query;
    this.logger.log(`Cliente conectado: ${client.id}`);
    this.logger.log({ userId, subjectId, token });
  }

  private logDisconnection(client: Socket) {
    const { userId, subjectId, token } = client.handshake.query;
    this.logger.log(`Cliente desconectado: ${client.id}`);
    this.logger.log('desconectado: ', { userId, subjectId, token });
  }

  private initClientData(clientId: string) {
    this.connectionDurations.set(clientId, 0);
    this.clientStartDates.set(clientId, Date.now());
  }

  private startTimer(client: Socket, clientId: string) {
    const interval = setInterval(() => {
      const duration = this.connectionDurations.get(clientId) ?? 0;
      this.connectionDurations.set(clientId, duration + 1);
      client.emit('connection-duration', duration + 1);
    }, 1000);
    this.clientTimers.set(clientId, interval);
  }

  private clearTimer(clientId: string) {
    const timer = this.clientTimers.get(clientId);
    if (timer) clearInterval(timer);
  }

  private clearClientData(clientId: string) {
    this.clientTimers.delete(clientId);
    this.connectionDurations.delete(clientId);
    this.clientStartDates.delete(clientId);
  }
}
