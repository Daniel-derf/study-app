import { PrismaService } from '../../database/prisma.service';
import { Subject } from '../entities/subject.entity';
import { ISubjectRepository } from './subject.interface.repository';

export class SubjectPrismaRepository implements ISubjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Subject[]> {
    const data = await this.prisma.subject.findMany();

    const subjects = data.map(Subject.reconstitute);

    return subjects;
  }

  async findById({ subjectId }: { subjectId: string }): Promise<Subject> {
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
      where: { subjectId: subject.subjectId },
      update: { ...data },
      create: { ...data },
    });
  }

  async delete(subjectId: string): Promise<void> {
    await this.prisma.subject.delete({ where: { subjectId } });
  }
}
