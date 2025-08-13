import { Logger } from '@nestjs/common';
import { FinishStudySessionUseCase } from './finish-study-session.usecase';
import { IStudySessionRepository } from '../repository/study-session.interface.repository';
import { IUserRepository } from '../../user/repository/user.repository.interface';
import { ISubjectRepository } from '../../subject/repositories/subject.interface.repository';
import { StudySession } from '../entities/study-session.entity';
import { User } from '../../user/entities/user.entity';
import { Subject } from '../../subject/entities/subject.entity';

describe('FinishStudySessionUseCase', () => {
  let useCase: FinishStudySessionUseCase;
  let sessionRepository: jest.Mocked<IStudySessionRepository>;
  let userRepository: jest.Mocked<IUserRepository>;
  let subjectRepository: jest.Mocked<ISubjectRepository>;
  let logger: Logger;

  const input = {
    startDate: new Date('2024-01-01T10:00:00Z'),
    endDate: new Date('2024-01-01T11:00:00Z'),
    subjectId: 'subject-uuid',
    userId: 'user-uuid',
  };

  beforeEach(() => {
    sessionRepository = {
      save: jest.fn(),
    } as any;

    userRepository = {
      findById: jest.fn(),
    } as any;

    subjectRepository = {
      findById: jest.fn(),
    } as any;

    logger = { log: jest.fn(), error: jest.fn() } as any;

    useCase = new FinishStudySessionUseCase(
      sessionRepository,
      userRepository,
      subjectRepository,
      logger,
    );
  });

  it('should save the session if both user and subject exist', async () => {
    const fakeUser = { toJSON: () => ({ name: 'Test User' }) } as User;
    userRepository.findById.mockResolvedValue(fakeUser);
    subjectRepository.findById.mockResolvedValue({} as Subject);

    const createSpy = jest.spyOn(StudySession, 'create').mockReturnValue({
      getDurationInMinutes: () => 60,
      toJSON: () => ({}),
    } as any);

    await useCase.execute(input);

    expect(userRepository.findById).toHaveBeenCalledWith(input.userId);
    expect(subjectRepository.findById).toHaveBeenCalledWith(input.subjectId);
    expect(sessionRepository.save).toHaveBeenCalled();
    expect(logger.log).toHaveBeenCalledWith(
      expect.stringContaining(
        'Session of 60 minutes saved successfully by user Test User',
      ),
    );
    createSpy.mockRestore();
  });

  it(`should log error if users doesn't exist`, async () => {
    userRepository.findById.mockResolvedValue(null);

    await useCase.execute(input);

    expect(logger.error).toHaveBeenCalledWith(
      `The user with ID ${input.userId} doesn't exist`,
    );
    expect(sessionRepository.save).not.toHaveBeenCalled();
  });

  it(`should log error if subject doesn't exist`, async () => {
    userRepository.findById.mockResolvedValue({
      toJSON: () => ({ name: 'Test User' }),
    } as User);
    subjectRepository.findById.mockResolvedValue(null);

    await useCase.execute(input);

    expect(logger.error).toHaveBeenCalledWith(
      `The subject with ID ${input.subjectId} doesn't exist`,
    );
    expect(sessionRepository.save).not.toHaveBeenCalled();
  });
});
