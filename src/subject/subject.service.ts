import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { ISubjectRepository } from './repositories/subject.interface.repository';
import { Subject } from './entities/subject.entity';
import { PrismaService } from '../database/prisma.service';
import { SubjectDto } from './dto/subject.dto';
import { FindSubjectInput, SubjectResponse } from './types';

@Injectable()
export class SubjectService {
  constructor(
    @Inject('ISubjectRepository')
    private readonly subjectRepository: ISubjectRepository,
    private readonly prisma: PrismaService,
  ) {}

  // Commands

  async create(createDto: CreateSubjectDto): Promise<SubjectDto> {
    const subject = Subject.create(createDto);
    await this.subjectRepository.save(subject);

    const plainSubject = subject.toJSON();

    return new SubjectDto(plainSubject);
  }

  async update(id: string, updateDto: UpdateSubjectDto): Promise<SubjectDto> {
    const subject = await this.subjectRepository.findById(id);

    if (!subject) throw new NotFoundException('This subject does not exist');

    if (updateDto.title !== undefined) {
      subject.updateTitle(updateDto.title);
    }
    if (updateDto.description !== undefined) {
      subject.updateDescription(updateDto.description);
    }
    if (updateDto.priority !== undefined) {
      subject.changePriority(updateDto.priority);
    }
    if (updateDto.color !== undefined) {
      subject.updateColor(updateDto.color);
    }

    await this.subjectRepository.save(subject);

    return new SubjectDto(subject.toJSON());
  }

  async remove(id: string): Promise<void> {
    const isSubjectExistent = await this.subjectRepository.findById(id);

    if (!isSubjectExistent)
      throw new NotFoundException('This subject does not exist');

    await this.subjectRepository.delete(id);
  }

  // Queries

  async findAll(page: number, limit: number): SubjectResponse {
    const safePage = Number.isInteger(page) && page > 0 ? page : 1;
    const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 10;

    const skip = (safePage - 1) * safeLimit;
    const [data, total] = await Promise.all([
      this.prisma.subject.findMany({
        skip,
        take: safeLimit,
        orderBy: { title: 'asc' },
      }),
      this.prisma.subject.count(),
    ]);

    const dtoData = data.map((data) => new SubjectDto(data));

    return {
      data: dtoData,
      total,
      page: safePage,
      lastPage: Math.ceil(total / safeLimit),
    };
  }

  async find(input: FindSubjectInput): SubjectResponse {
    const safePage =
      Number.isInteger(input.page) && input.page > 0 ? input.page : 1;
    const safeLimit =
      Number.isInteger(input.limit) && input.limit > 0 ? input.limit : 10;

    const skip = (safePage - 1) * safeLimit;
    const [data, total] = await Promise.all([
      this.prisma.subject.findMany({
        where: {
          ...(input.priority && { priority: input.priority }),
          ...(input.title && { title: input.title }),
        },
        skip,
        take: safeLimit,
        orderBy: { title: 'asc' },
      }),
      this.prisma.subject.count({
        where: {
          ...(input.priority && { priority: input.priority }),
          ...(input.title && { title: input.title }),
        },
      }),
    ]);

    const dtoData = data.map((data) => new SubjectDto(data));

    return {
      data: dtoData,
      total,
      page: safePage,
      lastPage: Math.ceil(total / safeLimit),
    };
  }

  async findOne(subjectId: string): Promise<SubjectDto> {
    const data = await this.prisma.subject.findUnique({ where: { subjectId } });

    if (!data) throw new NotFoundException('This subject does not exist');

    const subject = new SubjectDto(data);

    return subject;
  }
}
