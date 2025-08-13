import { Logger, Module } from '@nestjs/common';
import { StudySessionController } from './study-session.controller';
import { CounterGateway } from './session-counter.gateway';
import { PrismaService } from '../database/prisma.service';
import { UserPrismaRepository } from '../user/repository/user.repository.prisma';
import { SubjectPrismaRepository } from '../subject/repositories/subject.prisma.repository';
import { FinishStudySessionUseCase } from './use-cases/finish-study-session.usecase';
import { StudySessionPrismaRepository } from './repository/study-session.prisma.repository';
import { FindAllStudySessionsUseCase } from './use-cases/find-all-study-sessions.usecase';

@Module({
  controllers: [StudySessionController],
  providers: [
    FindAllStudySessionsUseCase,
    FinishStudySessionUseCase,
    CounterGateway,
    PrismaService,
    Logger,
    { provide: 'IUserRepository', useClass: UserPrismaRepository },
    { provide: 'ISubjectRepository', useClass: SubjectPrismaRepository },
    {
      provide: 'IStudySessionRepository',
      useClass: StudySessionPrismaRepository,
    },
  ],
})
export class StudySessionModule {}
