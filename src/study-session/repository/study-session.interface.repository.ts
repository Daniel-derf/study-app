import { StudySession } from '../entities/study-session.entity';

export interface IStudySessionRepository {
  findById(sessionId: string): Promise<StudySession>;

  save(session: StudySession): Promise<void>;
}
