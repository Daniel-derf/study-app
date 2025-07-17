import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { SubjectPrismaRepository } from './repositories/subject.prisma.repository';

@Module({
  controllers: [SubjectController],
  providers: [
    SubjectService,
    { provide: 'ISubjectRepository', useClass: SubjectPrismaRepository },
  ],
})
export class SubjectModule {}
