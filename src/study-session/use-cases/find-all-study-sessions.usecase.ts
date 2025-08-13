import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { StudySessionDto } from '../dto/study-session.dto';

@Injectable()
export class FindAllStudySessionsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: Input): Promise<PaginatedStudySessionDto> {
    const {
      userId,
      subjectId,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = input;

    const safePage = Number.isInteger(page) && page > 0 ? page : 1;
    const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 10;
    const skip = (safePage - 1) * safeLimit;

    const [sessions, total] = await Promise.all([
      this.prisma.studySession.findMany({
        where: {
          userId,
          ...(subjectId && { subjectId }),
          ...(startDate && { startDate: { gte: startDate } }),
          ...(endDate && { endDate: { lte: endDate } }),
        },
        include: {
          subject: {
            select: {
              title: true,
            },
          },
        },
        skip,
        take: safeLimit,
        orderBy: { startDate: 'desc' },
      }),
      this.prisma.studySession.count({
        where: {
          userId,
          ...(subjectId && { subjectId }),
          ...(startDate && { startDate: { gte: startDate } }),
          ...(endDate && { endDate: { lte: endDate } }),
        },
      }),
    ]);

    const data = sessions.map(
      (s) => new StudySessionDto({ ...s, subject: s.subject.title }),
    );

    return {
      data,
      total,
      page: safePage,
      lastPage: Math.ceil(total / safeLimit),
    };
  }
}

type Input = {
  userId: string;
  subjectId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
};

type PaginatedStudySessionDto = {
  data: StudySessionDto[];
  total: number;
  page: number;
  lastPage: number;
};
