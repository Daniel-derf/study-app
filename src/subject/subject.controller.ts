// src/subject/subject.controller.ts

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './entities/subject.entity';

@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  create(@Body() createSubjectDto: CreateSubjectDto): Promise<Subject> {
    return this.subjectService.create(createSubjectDto);
  }

  @Get()
  findAll(): Promise<Subject[]> {
    return this.subjectService.findAll();
  }

  @Get('search')
  find(
    @Query('priority') priority: string,
    @Query('title') title: string,
    @Query('userId') userId: string,
  ): Promise<Subject[]> {
    return this.subjectService.find({
      priority: Number(priority),
      title,
      userId,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Subject> {
    return this.subjectService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    return this.subjectService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.subjectService.remove(id);
  }
}
