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

  async create(createDto: CreateSubjectDto): Promise<Subject> {
    const subject = Subject.create(createDto);
    await this.subjectRepository.save(subject);
    return subject;
  }

  async update(id: string, updateDto: UpdateSubjectDto): Promise<Subject> {
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
    return subject;
  }

  async remove(id: string): Promise<void> {
    const isSubjectExistent = await this.subjectRepository.findById(id);

    if (!isSubjectExistent)
      throw new NotFoundException('This subject does not exist');

    await this.subjectRepository.delete(id);
  }

  // Queries

  async findAll(page: number, limit: number): SubjectResponse {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.subject.findMany({
        skip,
        take: limit,
        orderBy: { title: 'asc' },
      }),
      this.prisma.subject.count(),
    ]);

    const dtoData = data.map((data) => new SubjectDto(data));

    return {
      data: dtoData,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async find(input: FindSubjectInput): SubjectResponse {
    const { priority, title, page, limit } = input;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.subject.findMany({
        where: { priority, title },
        skip,
        take: limit,
        orderBy: { title: 'asc' },
      }),
      this.prisma.subject.count(),
    ]);

    const dtoData = data.map((data) => new SubjectDto(data));

    return {
      data: dtoData,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(subjectId: string): Promise<SubjectDto> {
    const data = await this.prisma.subject.findUnique({ where: { subjectId } });

    const subject = new SubjectDto(data);

    return subject;
  }
}
