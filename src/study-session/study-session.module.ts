import { Module } from '@nestjs/common';
import { StudySessionService } from './study-session.service';
import { StudySessionController } from './study-session.controller';
import { CounterGateway } from './session-counter.gateway';

@Module({
  controllers: [StudySessionController],
  providers: [StudySessionService, CounterGateway],
})
export class StudySessionModule {}
