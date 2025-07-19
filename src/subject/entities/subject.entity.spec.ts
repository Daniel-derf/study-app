import { Subject } from './subject.entity';

describe('Subject Entity', () => {
  const validInput = {
    userId: 'user-123',
    title: 'Valid Title',
    description: 'Valid description',
    priority: 5,
    color: '#abcdef',
  };

  it('should create a Subject with valid input', () => {
    const subject = Subject.create(validInput);

    expect(subject).toBeInstanceOf(Subject);
    expect(subject.subjectId).toBeDefined();
    expect(subject.userId).toBe(validInput.userId);
    expect(subject.title.title).toBe(validInput.title);
    expect(subject.description.description).toBe(validInput.description);
    expect(subject.priority.priority).toBe(validInput.priority);
    expect(subject.color.colorCode).toBe(validInput.color);
  });

  it('should throw error with invalid color', () => {
    expect(() =>
      Subject.create({ ...validInput, color: 'not-a-color' }),
    ).toThrow('Invalid color hex code');
  });

  it('should throw error with invalid priority (too low)', () => {
    expect(() => Subject.create({ ...validInput, priority: 0 })).toThrow(
      'Invalid priority.',
    );
  });

  it('should throw error with invalid priority (too high)', () => {
    expect(() => Subject.create({ ...validInput, priority: 11 })).toThrow(
      'Invalid priority.',
    );
  });

  it('should throw error with invalid title (too long)', () => {
    const longTitle = 'a'.repeat(61);
    expect(() => Subject.create({ ...validInput, title: longTitle })).toThrow(
      'Invalid sent title.',
    );
  });

  it('should throw error with invalid description (too long)', () => {
    const longDescription = 'a'.repeat(201);
    expect(() =>
      Subject.create({ ...validInput, description: longDescription }),
    ).toThrow('Invalid description.');
  });

  it('should update title', () => {
    const subject = Subject.create(validInput);
    subject.updateTitle('New Title');
    expect(subject.title.title).toBe('New Title');
  });

  it('should update description', () => {
    const subject = Subject.create(validInput);
    subject.updateDescription('New Description');
    expect(subject.description.description).toBe('New Description');
  });

  it('should update priority', () => {
    const subject = Subject.create(validInput);
    subject.changePriority(8);
    expect(subject.priority.priority).toBe(8);
  });

  it('should update color', () => {
    const subject = Subject.create(validInput);
    subject.updateColor('#123456');
    expect(subject.color.colorCode).toBe('#123456');
  });

  it('should reconstitute an existing Subject', () => {
    const subject = Subject.reconstitute(validInput);
    expect(subject).toBeInstanceOf(Subject);
    expect(subject.userId).toBe(validInput.userId);
  });
});
