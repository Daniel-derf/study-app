import { PrismaService } from '../../database/prisma.service';
import { StudySession } from '../entities/study-session.entity';
import { IStudySessionRepository } from './study-session.interface.repository';

export class StudySessionPrismaRepository implements IStudySessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(sessionId: string): Promise<StudySession> {
    const data = await this.prisma.studySession.findUnique({
      where: { sessionId },
    });

    const session = StudySession.reconstitute(data);

    return session;
  }

  async save(session: StudySession): Promise<void> {
    const data = session.toJson();

    await this.prisma.studySession.upsert({
      where: { sessionId: data.sessionId },
      update: {
        userId: data.userId,
        subjectId: data.subjectId,
        startDate: data.startDate,
        endDate: data.endDate,
        duration: data.duration,
      },
      create: {
        sessionId: data.sessionId,
        userId: data.userId,
        subjectId: data.subjectId,
        startDate: data.startDate,
        endDate: data.endDate,
        duration: data.duration,
      },
    });
  }
}
