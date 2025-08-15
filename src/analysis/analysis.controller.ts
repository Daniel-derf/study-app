import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisDateQueryDto } from './dto/analysis-date-query.dto';
import { UserFromJwt } from '../common/types/user-from-jwt';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @UseGuards(JwtAuthGuard)
  @Get('most-studied')
  async getMostStudiedSubjects(
    @Req() { user }: { user: UserFromJwt },
    @Query() query: AnalysisDateQueryDto,
  ) {
    const userId = user.userId;

    const data = await this.analysisService.findMostStudiedSubjects({
      userId,
      endDate: query.endDate,
      startDate: query.startDate,
    });

    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Get('to-study')
  async getSubjectsToBeStudied(
    @Req() { user }: { user: UserFromJwt },
    @Query() query: AnalysisDateQueryDto,
  ) {
    const userId = user.userId;

    const data = await this.analysisService.findSubjectsToBeStudied({
      userId,
      endDate: query.endDate,
      startDate: query.startDate,
    });

    return { data };
  }
}
