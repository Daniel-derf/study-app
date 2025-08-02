import { Module } from '@nestjs/common';
import { StudySessionService } from './study-session.service';
import { StudySessionController } from './study-session.controller';

@Module({
  controllers: [StudySessionController],
  providers: [StudySessionService],
})
export class StudySessionModule {}
