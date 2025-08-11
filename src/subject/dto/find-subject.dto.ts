import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class FindSubjectQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Prioridade do assunto' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  priority?: number;

  @ApiPropertyOptional({ description: 'Título do assunto' })
  @IsOptional()
  @IsString()
  title?: string;
}
