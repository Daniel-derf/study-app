// src/app.gateway.ts
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['*'],
    credentials: true,
  },
})
export class CounterGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // Map para armazenar o contador de cada cliente
  private clientTimers: Map<string, NodeJS.Timeout> = new Map();

  // Map para armazenar a duração da conexão de cada cliente
  private connectionDurations: Map<string, number> = new Map();

  handleConnection(client: Socket) {
    const clientId = client.id;
    console.log(`Cliente conectado: ${clientId}`);

    const { userId, subjectId, token } = client.handshake.query;

    console.log({ userId, subjectId, token });

    // Inicializa a duração
    this.connectionDurations.set(clientId, 0);

    // Cria o contador que incrementa a cada segundo
    const interval = setInterval(() => {
      const duration = this.connectionDurations.get(clientId) ?? 0;
      this.connectionDurations.set(clientId, duration + 1);

      // Opcional: enviar a duração para o cliente
      client.emit('connection-duration', duration + 1);
    }, 1000);

    // Armazena o timer
    this.clientTimers.set(clientId, interval);
  }

  handleDisconnect(client: Socket) {
    const clientId = client.id;
    console.log(`Cliente desconectado: ${clientId}`);

    const { userId, subjectId, token } = client.handshake.query;

    console.log('desconectado: ', { userId, subjectId, token });

    // Para o contador
    const timer = this.clientTimers.get(clientId);
    if (timer) {
      clearInterval(timer);
    }

    // Pega a duração final
    const totalDuration = this.connectionDurations.get(clientId) ?? 0;
    console.log(
      `Duração da conexão do cliente ${clientId}: ${totalDuration} segundos`,
    );

    // Limpa os dados
    this.clientTimers.delete(clientId);
    this.connectionDurations.delete(clientId);
  }
}
