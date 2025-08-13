import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { FindAllStudySessionsUseCase } from './use-cases/find-all-study-sessions.usecase';
import { JwtAuthGuard } from '../auth/auth.guard';

type UserFromJwt = {
  userId: string;
  email: string;
};

@Controller('study-sessions')
export class StudySessionController {
  constructor(
    private readonly findAllSessionsUseCase: FindAllStudySessionsUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Req() { user }: { user: UserFromJwt },
    @Query('subjectId') subjectId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const input = {
      userId: user.userId,
      subjectId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    };

    const data = await this.findAllSessionsUseCase.execute(input);

    return { data };
  }
}
