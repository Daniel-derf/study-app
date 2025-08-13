export class StudySessionDto {
  constructor(input: Input) {
    this.sessionId = input.sessionId;
    this.startDate = input.startDate;
    this.endDate = input.endDate;
    this.subject = input.subject;
  }

  sessionId: string;
  startDate: Date;
  endDate: Date;
  subject: string;
}

type Input = {
  sessionId: string;
  startDate: Date;
  endDate: Date;
  subject: string;
};
