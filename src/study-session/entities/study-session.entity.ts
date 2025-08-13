import { randomUUID } from 'crypto';
import { DomainError } from '../../common/domain.error';

class StudyDate {
  value: Date;

  private constructor(date: Date) {
    this.value = date;
  }

  static create(date: Date) {
    const isInvalidDate = isNaN(date.getTime());

    if (isInvalidDate) {
      throw new DomainError('Invalid date');
    }

    return new StudyDate(date);
  }

  static reconstitute(date: Date) {
    return new StudyDate(date);
  }
}

class Duration {
  value: number;

  private constructor(value: number) {
    this.value = value;
  }

  static create(value: number) {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new DomainError('The study duration must be a number');
    }

    if (value <= 0) {
      throw new DomainError('The study duration must be greater than 0');
    }

    return new Duration(value);
  }

  static reconstitute(value: number) {
    return new Duration(value);
  }
}

type StudySessionInnerInput = {
  sessionId: string;
  duration: Duration;
  startDate: StudyDate;
  endDate: StudyDate;
  subjectId: string;
  userId: string;
};

export type StudySessionInput = {
  sessionId?: string;
  duration?: number;
  userId: string;
  startDate: Date;
  endDate: Date;
  subjectId: string;
};

export class StudySession {
  sessionId: string;
  subjectId: string;
  userId: string;

  private _startDate: StudyDate;
  private _endDate: StudyDate;
  private _duration: Duration;

  private constructor(input: StudySessionInnerInput) {
    this.sessionId = input.sessionId;
    this.subjectId = input.subjectId;
    this.userId = input.userId;
    this._duration = input.duration;
    this._startDate = input.startDate;
    this._endDate = input.endDate;
  }

  static create(input: StudySessionInput) {
    const startDate = StudyDate.create(input.startDate);
    const endDate = StudyDate.create(input.endDate);
    const userId = input.userId;

    if (startDate.value.getTime() >= endDate.value.getTime())
      throw new DomainError('The end date must be greater than the start date');

    const durationInput = Math.floor(
      (input.endDate.getTime() - input.startDate.getTime()) / 1000,
    );
    const duration = Duration.create(durationInput);

    const validatedInput: StudySessionInnerInput = {
      sessionId: randomUUID(),
      subjectId: input.subjectId,
      duration,
      startDate,
      userId,
      endDate,
    };

    return new StudySession(validatedInput);
  }

  static reconstitute(input: StudySessionInput) {
    const innerInput: StudySessionInnerInput = {
      sessionId: input.sessionId,
      subjectId: input.subjectId,
      userId: input.userId,
      duration: Duration.reconstitute(input.duration),
      startDate: StudyDate.reconstitute(input.startDate),
      endDate: StudyDate.reconstitute(input.endDate),
    };

    return new StudySession(innerInput);
  }

  get startDate() {
    return this._startDate.value;
  }

  get endDate() {
    return this._endDate.value;
  }

  get duration() {
    return this._duration.value;
  }

  getDurationInMinutes() {
    const durationMinutes = this.duration / 60;

    return durationMinutes;
  }

  toJson() {
    return {
      sessionId: this.sessionId,
      duration: this.duration,
      subjectId: this.subjectId,
      startDate: this.startDate,
      endDate: this.endDate,
      userId: this.userId,
    };
  }
}
