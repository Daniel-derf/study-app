import { Inject, Injectable, Logger } from '@nestjs/common';
import { IStudySessionRepository } from '../repository/study-session.interface.repository';
import { StudySession } from '../entities/study-session.entity';
import { IUserRepository } from '../../user/repository/user.repository.interface';
import { ISubjectRepository } from '../../subject/repositories/subject.interface.repository';

@Injectable()
export class FinishStudySessionUseCase {
  constructor(
    @Inject('IStudySessionRepository')
    private readonly sessionRepository: IStudySessionRepository,

    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,

    @Inject('ISubjectRepository')
    private readonly subjectRepository: ISubjectRepository,

    private readonly logger: Logger,
  ) {}

  async execute(input: Input) {
    const { userId, subjectId } = input;

    const userExists = await this.userRepository.findById(userId);

    if (!userExists) {
      this.logger.error(`The user with ID ${userId} doesn't exist`);

      return;
    }

    const subjectExists = await this.subjectRepository.findById(subjectId);

    if (!subjectExists) {
      this.logger.error(`The subject with ID ${subjectId} doesn't exist`);

      return;
    }

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
