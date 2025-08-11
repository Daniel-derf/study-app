import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Subject } from '../entities/subject.entity';
import { ISubjectRepository } from './subject.interface.repository';

@Injectable()
export class SubjectPrismaRepository implements ISubjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(subjectId: string): Promise<Subject> {
    const data = await this.prisma.subject.findUnique({ where: { subjectId } });

    const subject = Subject.reconstitute(data);

    return subject;
  }

  async findBy({
    priority,
    title,
  }: {
    priority: number;
    title: string;
  }): Promise<Subject[]> {
    const data = await this.prisma.subject.findMany({
      where: { priority, title },
    });

    const subjects = data.map(Subject.reconstitute);

    return subjects;
  }

  async save(subject: Subject): Promise<void> {
    const data = subject.toJSON();

    await this.prisma.subject.upsert({
      where: { subjectId: data.subjectId },
      update: {
        ...data,
      },
      create: {
        ...data,
      },
    });
  }

  async delete(subjectId: string): Promise<void> {
    await this.prisma.subject.delete({ where: { subjectId } });
  }
}
