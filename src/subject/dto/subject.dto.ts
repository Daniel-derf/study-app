export class SubjectDto {
  subjectId: string;
  userId: string;
  title: string;
  description: string;
  priority: number;
  color: string;

  constructor(input: SubjectDtoInput) {
    this.subjectId = input.subjectId;
    this.title = input.title;
    this.description = input.description;
    this.priority = input.priority;
    this.color = input.color;
    this.userId = input.userId;
  }
}

type SubjectDtoInput = {
  subjectId: string;
  userId: string;
  title: string;
  description: string;
  priority: number;
  color: string;
};
