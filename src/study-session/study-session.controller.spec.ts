import { Test, TestingModule } from '@nestjs/testing';
import { StudySessionController } from './study-session.controller';
import { StudySessionService } from './study-session.service';

describe('StudySessionController', () => {
  let controller: StudySessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudySessionController],
      providers: [StudySessionService],
    }).compile();

    controller = module.get<StudySessionController>(StudySessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
