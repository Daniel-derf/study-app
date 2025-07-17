import { Subject } from '../entities/subject.entity';
import { ISubjectRepository } from './subject.interface.repository';

export class SubjectPrismaRepository implements ISubjectRepository {
  findAll(): Promise<Subject[]> {
    throw new Error('Method not implemented');
  }

  findById(input: { subjectId: string }): Promise<Subject> {
    throw new Error('Method not implemented.');
  }
  findBy(input: { priority: number; title: string }): Promise<Subject[]> {
    throw new Error('Method not implemented.');
  }
  save(subject: Subject): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(subjectId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
