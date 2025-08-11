import { Module } from '@nestjs/common';
import { StudySessionController } from './study-session.controller';
import { CounterGateway } from './session-counter.gateway';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [StudySessionController],
  providers: [CounterGateway, PrismaService],
})
export class StudySessionModule {}
