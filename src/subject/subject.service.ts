// src/subject/subject.service.ts

import { Inject, Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { ISubjectRepository } from './repositories/subject.interface.repository';
import { Subject } from './entities/subject.entity';

@Injectable()
export class SubjectService {
  constructor(
    @Inject('ISubjectRepository')
    private readonly subjectRepository: ISubjectRepository,
  ) {}

  async create(createDto: CreateSubjectDto): Promise<Subject> {
    const subject = Subject.create(createDto);
    await this.subjectRepository.save(subject);
    return subject;
  }

  async findAll(): Promise<Subject[]> {
    return this.subjectRepository.findAll();
  }

  async find(filter: { priority: number; title: string }): Promise<Subject[]> {
    return this.subjectRepository.findBy(filter);
  }

  async findOne(id: string): Promise<Subject> {
    return await this.subjectRepository.findById({ subjectId: id });
  }

  async update(id: string, updateDto: UpdateSubjectDto): Promise<Subject> {
    const subject = await this.findOne(id);

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
    const isSubjectExistent = await this.findOne(id);

    if (!isSubjectExistent) throw new Error('Subject does not exist');

    await this.subjectRepository.delete(id);
  }
}
