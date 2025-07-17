import { Subject } from '../entities/subject.entity';

export interface SubjectInterfaceRepository {
  findById(input: { subjectId: string }): Promise<Subject>;

  findBy(input: { priority: number; title: string }): Promise<Subject[]>;

  save(subject: Subject): Promise<void>;

  delete(subjectId: string): Promise<void>;
}
