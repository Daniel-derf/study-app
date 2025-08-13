import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FinishStudySessionUseCase } from './use-cases/finish-study-session.usecase';
import { Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

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
  private clientUserIds: Map<string, string> = new Map();

  handleConnection(client: Socket) {
    try {
      const clientId = client.id;
      const token = client.handshake.query?.token as string;

      const payload = this.validateToken(token);

      const userID = payload.sub as string;

      this.clientUserIds.set(clientId, userID);

      this.logger.log(`Client connected: ${client.id}`);

      this.initClientData(clientId);
      this.startTimer(client, clientId);
    } catch (error) {
      this.logger.error(error.message);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const clientId = client.id;
      this.logger.log(`Client disconnected: ${client.id}`);

      this.clearTimer(clientId);

      const startDate = this.clientStartDates.get(clientId);
      const userId = this.clientUserIds.get(clientId);

      if (startDate && userId) {
        const endDate = Date.now();
        await this.finishStudySessionUseCase.execute({
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          userId,
          subjectId: String(client.handshake.query?.subjectId),
        });
      }

      this.clearClientData(clientId);
      this.clientUserIds.delete(clientId);
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  private validateToken(token: string) {
    if (!token) {
      throw new Error('Token is missing');
    }
    if (typeof token !== 'string') {
      throw new Error('Invalid token');
    }
    try {
      const secret = process.env.JWT_SECRET;
      return jwt.verify(token, secret);
    } catch (err) {
      this.logger.error(`jwt error: ${err.message}`);
      throw new Error('Invalid or expired token');
    }
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
