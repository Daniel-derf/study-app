import { Inject, Injectable, Logger } from '@nestjs/common';
import { IStudySessionRepository } from '../repository/study-session.interface.repository';
import { StudySession } from '../entities/study-session.entity';
import { IUserRepository } from '../../user/repository/user.repository.interface';
import { ISubjectRepository } from '../../subject/repositories/subject.interface.repository';
import { User } from '../../user/entities/user.entity';

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

    const user = await this.userRepository.findById(userId);

    if (!user) {
      this.logger.error(`The user with ID ${userId} doesn't exist`);

      return;
    }

    const subjectExists = await this.subjectRepository.findById(subjectId);

    if (!subjectExists) {
      this.logger.error(`The subject with ID ${subjectId} doesn't exist`);

      return;
    }

    const session = StudySession.create({ ...input });

    await this.sessionRepository.save(session);

    this.logSession(session, user);
  }

  private logSession(session: StudySession, user: User) {
    const durationMinutes = session.getDurationInMinutes();
    const { name } = user.toJSON();
    this.logger.log(
      `Session of ${Math.floor(durationMinutes)} minutes saved successfully by user ${name}`,
    );
  }
}

type Input = {
  startDate: Date;
  endDate: Date;
  subjectId: string;
  userId: string;
};
