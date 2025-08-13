import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { StudySessionDto } from '../dto/study-session.dto';

@Injectable()
export class FindAllStudySessionsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: Input): Promise<StudySessionDto[]> {
    const { userId } = input;

    const sessions = await this.prisma.studySession.findMany({
      where: { userId },
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
};
