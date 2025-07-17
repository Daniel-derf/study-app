// __tests__/subject.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { SubjectController } from './subject.controller';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './entities/subject.entity';

describe('SubjectController', () => {
  let controller: SubjectController;
  let service: jest.Mocked<SubjectService>;

  const mockSubject = Subject.reconstitute({
    title: 'T',
    description: 'D',
    priority: 1,
    color: '#fff',
  });

  mockSubject.subjectId = 'abc-123';

  const mockService = {
    create: jest.fn().mockResolvedValue(mockSubject),
    findAll: jest.fn().mockResolvedValue([mockSubject]),
    find: jest.fn().mockResolvedValue([mockSubject]),
    findOne: jest.fn().mockResolvedValue(mockSubject),
    update: jest.fn().mockResolvedValue(mockSubject),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubjectController],
      providers: [{ provide: SubjectService, useValue: mockService }],
    }).compile();

    controller = module.get<SubjectController>(SubjectController);
    service = module.get(SubjectService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should call service.create and return its result', async () => {
      const dto: CreateSubjectDto = {
        title: 'T',
        description: 'D',
        priority: 1,
        color: '#fff',
      };
      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toBe(mockSubject);
    });
  });

  describe('findAll()', () => {
    it('should call service.findAll and return its result', async () => {
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockSubject]);
    });
  });

  describe('find()', () => {
    it('should call service.find with parsed query params', async () => {
      const result = await controller.find('2', 'foo', 'user1');
      expect(service.find).toHaveBeenCalledWith({
        priority: 2,
        title: 'foo',
        userId: 'user1',
      });
      expect(result).toEqual([mockSubject]);
    });
  });

  describe('findOne()', () => {
    it('should call service.findOne and return its result', async () => {
      const result = await controller.findOne('abc-123');
      expect(service.findOne).toHaveBeenCalledWith('abc-123');
      expect(result).toBe(mockSubject);
    });
  });

  describe('update()', () => {
    it('should call service.update and return its result', async () => {
      const dto: UpdateSubjectDto = {
        title: 'New',
        description: 'NewD',
        priority: 5,
        color: '#aaa',
      };
      const result = await controller.update('abc-123', dto);
      expect(service.update).toHaveBeenCalledWith('abc-123', dto);
      expect(result).toBe(mockSubject);
    });
  });

  describe('remove()', () => {
    it('should call service.remove and return its result', async () => {
      const result = await controller.remove('abc-123');
      expect(service.remove).toHaveBeenCalledWith('abc-123');
      expect(result).toBeUndefined();
    });
  });
});
