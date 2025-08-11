import { SubjectDto } from './dto/subject.dto';

export type SubjectResponse = Promise<{
  data: SubjectDto[];
  total: number;
  page: number;
  lastPage: number;
}>;

export type FindSubjectInput = {
  priority: number;
  title: string;
  page: number;
  limit: number;
};
