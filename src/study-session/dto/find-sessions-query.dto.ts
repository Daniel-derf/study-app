import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class FindSessionsQueryDto extends PaginationQueryDto {
  subjectId?: string;
  startDate?: string;
  endDate?: string;
}
