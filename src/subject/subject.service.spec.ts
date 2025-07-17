// __tests__/subject.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { SubjectService } from './subject.service';
import { ISubjectRepository } from './repositories/subject.interface.repository';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './entities/subject.entity';

describe('SubjectService', () => {
  let service: SubjectService;
  let mockRepo: jest.Mocked<ISubjectRepository>;

  beforeEach(async () => {
    mockRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findBy: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubjectService,
        { provide: 'ISubjectRepository', useValue: mockRepo },
      ],
    }).compile();

    service = module.get<SubjectService>(SubjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new Subject', async () => {
      const dto: CreateSubjectDto = {
        title: 'Test',
        description: 'Desc',
        userId: '123',
        priority: 3,
        color: '#abc123',
      };

      // call create
      const result = await service.create(dto);

      // should call save once with a Subject instance
      expect(mockRepo.save).toHaveBeenCalledTimes(1);
      const savedSubject = mockRepo.save.mock.calls[0][0];
      expect(savedSubject).toBeInstanceOf(Subject);
      expect(savedSubject.title).toBe(dto.title);
      expect(savedSubject.description).toBe(dto.description);
      expect(savedSubject.priority).toBe(dto.priority);
      expect(savedSubject.color).toBe(dto.color);

      // should return the created subject
      expect(result).toBe(savedSubject);
    });
  });

  describe('findAll', () => {
    it('should return all subjects', async () => {
      const subjects = [
        Subject.create({
          title: 'A',
          description: 'B',
          userId: '123',
          priority: 1,
          color: '#fff',
        }),
      ];
      mockRepo.findAll.mockResolvedValue(subjects);

      const result = await service.findAll();
      expect(mockRepo.findAll).toHaveBeenCalled();
      expect(result).toBe(subjects);
    });
  });

  describe('find', () => {
    it('should delegate to repository.findBy', async () => {
      const filter = { priority: 2, title: 'foo', userId: 'u1' };
      const subjects = [
        Subject.create({
          title: 'foo',
          description: 'bar',
          priority: 2,
          userId: '123',
          color: '#000',
        }),
      ];
      mockRepo.findBy.mockResolvedValue(subjects);

      const result = await service.find(filter);
      expect(mockRepo.findBy).toHaveBeenCalledWith(filter);
      expect(result).toBe(subjects);
    });
  });

  describe('findOne', () => {
    it('should return a subject when found', async () => {
      const subj = Subject.create({
        title: 'X',
        description: 'Y',
        priority: 5,
        userId: '123',
        color: '#123',
      });
      mockRepo.findById.mockResolvedValue(subj);

      const result = await service.findOne('id-123');
      expect(mockRepo.findById).toHaveBeenCalledWith({ subjectId: 'id-123' });
      expect(result).toBe(subj);
    });

    it('should throw if not found', async () => {
      mockRepo.findById.mockRejectedValue(new Error('Not found'));
      await expect(service.findOne('nope')).rejects.toThrow('Not found');
    });
  });

  describe('update', () => {
    it('should load, apply updates and save', async () => {
      const original = Subject.create({
        title: 'Old',
        description: 'OldDesc',
        userId: '123',
        priority: 4,
        color: '#aaa',
      });
      mockRepo.findById.mockResolvedValue(original);
      mockRepo.save.mockResolvedValue();

      const dto: UpdateSubjectDto = {
        title: 'New',
        description: 'NewDesc',
        priority: 7,
        color: '#bbb',
      };
      const result = await service.update('id-1', dto);

      // verify loaded
      expect(mockRepo.findById).toHaveBeenCalledWith({ subjectId: 'id-1' });
      // verify fields updated
      expect(result.title).toBe(dto.title);
      expect(result.description).toBe(dto.description);
      expect(result.priority).toBe(dto.priority);
      expect(result.color).toBe(dto.color);
      // verify save called with updated entity
      expect(mockRepo.save).toHaveBeenCalledWith(result);
    });

    it('should update partial fields only', async () => {
      const original = Subject.create({
        title: 'T',
        description: 'D',
        userId: '123',
        priority: 1,
        color: '#fff',
      });
      mockRepo.findById.mockResolvedValue(original);
      mockRepo.save.mockResolvedValue();

      const dto: UpdateSubjectDto = { title: 'TT' };
      const result = await service.update('id-2', dto);

      expect(result.title).toBe('TT');
      expect(result.description).toBe('D');
      expect(result.priority).toBe(1);
      expect(result.color).toBe('#fff');
      expect(mockRepo.save).toHaveBeenCalledWith(result);
    });
  });

  describe('remove', () => {
    it('should delete existing subject', async () => {
      const subj = Subject.create({
        title: 'A',
        userId: '123',
        description: 'B',
        priority: 1,
        color: '#fff',
      });
      mockRepo.findById.mockResolvedValue(subj);
      mockRepo.delete.mockResolvedValue();

      await service.remove('id-3');

      expect(mockRepo.findById).toHaveBeenCalledWith({ subjectId: 'id-3' });
      expect(mockRepo.delete).toHaveBeenCalledWith('id-3');
    });
  });
});
