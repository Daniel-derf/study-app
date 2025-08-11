import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Subject } from './entities/subject.entity';
import { JwtAuthGuard } from '../auth/auth.guard';

@ApiTags('Subjects')
@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @ApiCreatedResponse({
    description: 'Creates and returns a Subject',
    type: Subject,
  })
  @ApiOperation({ summary: 'Create a new study subject' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createSubjectDto: CreateSubjectDto) {
    const subject = await this.subjectService.create(createSubjectDto);

    return { message: 'Subject created successfully!', data: subject };
  }

  @ApiOkResponse({
    description: 'List of Subject objects',
    type: Subject,
    isArray: true,
  })
  @ApiOperation({ summary: 'Get all study subjects for the logged-in user' })
  @UseGuards(JwtAuthGuard)
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Número da página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Quantidade por página',
  })
  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    const data = this.subjectService.findAll(+page, +limit);

    return data;
  }

  @ApiOkResponse({
    description: 'List of filtered Subject objects',
    type: Subject,
    isArray: true,
  })
  @ApiOperation({
    summary: 'Search study subjects for the logged-in user with filters',
  })
  @UseGuards(JwtAuthGuard)
  @ApiQuery({
    name: 'priority',
    required: false,
    type: Number,
    description: 'Prioridade do assunto',
  })
  @ApiQuery({
    name: 'title',
    required: false,
    type: String,
    description: 'Título do assunto',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Número da página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Quantidade por página',
  })
  @Get('search')
  async find(
    @Query('priority') priority: string,
    @Query('title') title: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const data = await this.subjectService.find({
      priority: priority ? Number(priority) : undefined,
      title,
      page: +page,
      limit: +limit,
    });

    return data;
  }

  @ApiOkResponse({
    description: 'Subject object',
    type: Subject,
  })
  @ApiOperation({
    summary: 'Get a study subject by ID if it belongs to the logged-in user',
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = this.subjectService.findOne(id);

    return { data };
  }

  @ApiOkResponse({
    description: 'Subject updated successfully',
    type: Subject,
  })
  @ApiOperation({ summary: 'Update a study subject for the logged-in user' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    const subject = await this.subjectService.update(id, updateSubjectDto);

    return { message: 'Subject updated successfully', data: subject };
  }

  @ApiOperation({ summary: 'Delete a study subject for the logged-in user' })
  @ApiNoContentResponse({ description: 'Subject deleted successfully' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.subjectService.remove(id);
  }
}
