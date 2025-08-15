import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class AnalysisDateQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  startDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  endDate: Date;
}
