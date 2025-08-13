import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { SubjectPrismaRepository } from './repositories/subject.prisma.repository';
import { PrismaService } from '../database/prisma.service';
import { UserPrismaRepository } from '../user/repository/user.repository.prisma';

@Module({
  controllers: [SubjectController],
  providers: [
    SubjectService,
    PrismaService,
    { provide: 'ISubjectRepository', useClass: SubjectPrismaRepository },
    { provide: 'IUserRepository', useClass: UserPrismaRepository },
  ],
})
export class SubjectModule {}
