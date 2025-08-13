import { Injectable, Logger } from '@nestjs/common';
import { IStudySessionRepository } from '../repository/study-session.interface.repository';
import { StudySession } from '../entities/study-session.entity';

@Injectable()
export class FinishStudySessionUseCase {
  constructor(
    private readonly sessionRepository: IStudySessionRepository,
    private readonly logger: Logger,
  ) {}

  async execute(input: Input) {
    const duration = Math.floor(
      (input.endDate.getTime() - input.startDate.getTime()) / 1000,
    );

    const session = StudySession.create({ ...input, duration });

    await this.sessionRepository.save(session);

    const durationMinutes = duration / 60;

    this.logger.log(`Session of ${durationMinutes} minutes saved successfully`);
  }
}

type Input = {
  startDate: Date;
  endDate: Date;
  subjectId: string;
  userId: string;
};
