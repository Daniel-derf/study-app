import { StudySession, StudySessionInput } from './study-session.entity';
import { DomainError } from '../../common/domain.error';

describe('StudySession', () => {
  const validInput: StudySessionInput = {
    subjectId: 'subject-123',
    startDate: new Date('2025-08-01T10:00:00Z'),
    endDate: new Date('2025-08-01T11:00:00Z'),
    userId: 'user-123',
    duration: 3600,
  };

  it('creates a valid study session with correct input', () => {
    const session = StudySession.create(validInput);

    expect(session).toBeInstanceOf(StudySession);
    expect(session.sessionId).toBeDefined();
    expect(session.userId).toBeDefined();
    expect(session.subjectId).toBe(validInput.subjectId);
    expect(session.duration).toBe(validInput.duration);
    expect(session.startDate.toISOString()).toBe(
      validInput.startDate.toISOString(),
    );
    expect(session.endDate.toISOString()).toBe(
      validInput.endDate.toISOString(),
    );
  });

  it('throws if startDate is invalid', () => {
    const input = { ...validInput, startDate: new Date('invalid') };

    expect(() => StudySession.create(input)).toThrow(DomainError);
    expect(() => StudySession.create(input)).toThrow('Invalid date');
  });

  it('throws if endDate is invalid', () => {
    const input = { ...validInput, endDate: new Date('invalid') };

    expect(() => StudySession.create(input)).toThrow(DomainError);
    expect(() => StudySession.create(input)).toThrow('Invalid date');
  });

  it('throws if startDate is greater than or equal to endDate', () => {
    const input = {
      ...validInput,
      startDate: new Date('2025-08-01T11:00:00Z'),
      endDate: new Date('2025-08-01T10:00:00Z'),
    };

    expect(() => StudySession.create(input)).toThrow(DomainError);
    expect(() => StudySession.create(input)).toThrow(
      'end date must be greater',
    );
  });

  it('reconstitutes a study session from persisted data', () => {
    const session = StudySession.create(validInput);
    const plain = session.toJson();

    const reconstituted = StudySession.reconstitute({
      ...plain,
      sessionId: plain.sessionId,
    });

    expect(reconstituted.sessionId).toBe(plain.sessionId);
    expect(reconstituted.startDate.toISOString()).toBe(
      plain.startDate.toISOString(),
    );
    expect(reconstituted.endDate.toISOString()).toBe(
      plain.endDate.toISOString(),
    );
    expect(reconstituted.duration).toBe(plain.duration);
  });
});
