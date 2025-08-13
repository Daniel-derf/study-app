import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { StudySessionDto } from '../dto/study-session.dto';

@Injectable()
export class FindAllStudySessionsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: Input): Promise<StudySessionDto[]> {
    const { userId, subjectId, startDate, endDate } = input;

    const sessions = await this.prisma.studySession.findMany({
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
    });

    const output = sessions.map(
      (s) => new StudySessionDto({ ...s, subject: s.subject.title }),
    );

    return output;
  }
}

type Input = {
  userId: string;
  subjectId?: string;
  startDate?: Date;
  endDate?: Date;
};
