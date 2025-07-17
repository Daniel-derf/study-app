// __tests__/Subject.test.ts

import * as crypto from 'crypto';
import { Subject, SubjectInput } from './subject.entity';
import { isHexColor } from '../utils';

describe('Subject', () => {
  const VALID_INPUT: SubjectInput = {
    title: 'Valid title',
    userId: '12312',
    description: 'Valid description under 200 characters.',
    priority: 5,
    color: '#abcdef',
  };

  const FAKE_UUID = '00000000-0000-0000-0000-000000000000';

  beforeAll(() => {
    jest.spyOn(crypto, 'randomUUID').mockReturnValue(FAKE_UUID);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('create()', () => {
    it('should create a valid instance without subjectId, generating a UUID', () => {
      const subj = Subject.create(VALID_INPUT);
      expect(subj.subjectId).toBe(FAKE_UUID);
      expect(subj.title).toBe(VALID_INPUT.title);
      expect(subj.description).toBe(VALID_INPUT.description);
      expect(subj.priority).toBe(VALID_INPUT.priority);
      expect(subj.color).toBe(VALID_INPUT.color);
    });

    it('should respect a provided subjectId in the input', () => {
      const customInput = { ...VALID_INPUT, subjectId: FAKE_UUID };
      const subj = Subject.create(customInput);
      expect(subj.subjectId).toBe(FAKE_UUID);
    });

    it('should throw an error if the color is invalid', () => {
      const bad = { ...VALID_INPUT, color: 'blue' };
      expect(() => Subject.create(bad)).toThrow(/hex color code/);
    });

    it('should throw an error if priority is less than 1', () => {
      const bad = { ...VALID_INPUT, priority: 0 };
      expect(() => Subject.create(bad)).toThrow(
        /priority value between 1 and 10/,
      );
    });

    it('should throw an error if priority is greater than 10', () => {
      const bad = { ...VALID_INPUT, priority: 11 };
      expect(() => Subject.create(bad)).toThrow(
        /priority value between 1 and 10/,
      );
    });

    it('should throw an error if the description is too long', () => {
      const longDesc = 'a'.repeat(200);
      const bad = { ...VALID_INPUT, description: longDesc };
      expect(() => Subject.create(bad)).toThrow(/max length of 200/);
    });

    it('should throw an error if the title is too long', () => {
      const longTitle = 'a'.repeat(60);
      const bad = { ...VALID_INPUT, title: longTitle };
      expect(() => Subject.create(bad)).toThrow(/max length of 60/);
    });
  });

  describe('reconstitute()', () => {
    it('should hydrate the instance without validating, preserving the record’s subjectId', () => {
      const record: Required<SubjectInput> = {
        subjectId: 'persisted-id',
        userId: '1',
        title: VALID_INPUT.title,
        description: VALID_INPUT.description,
        priority: VALID_INPUT.priority,
        color: VALID_INPUT.color,
      };
      const subj = Subject.reconstitute(record);
      expect(subj.subjectId).toBe('persisted-id');
      expect(subj.title).toBe(record.title);
    });

    it('should skip validation even if fields are invalid', () => {
      const badRecord: Required<SubjectInput> = {
        subjectId: 'x',
        userId: '1',
        title: 'a'.repeat(100),
        description: 'b'.repeat(300),
        priority: 99,
        color: 'nope',
      };
      expect(() => Subject.reconstitute(badRecord)).not.toThrow();
      const subj = Subject.reconstitute(badRecord);
      expect(subj.title).toHaveLength(100);
      expect(subj.description).toHaveLength(300);
      expect(subj.priority).toBe(99);
      expect(subj.color).toBe('nope');
    });
  });

  describe('validate()', () => {
    it('accepts all valid 3- and 6-digit hex colors', () => {
      ['#fff', '#FFFFFF', '#123abc', '#ABC'].forEach((c) => {
        expect(isHexColor(c)).toBe(true);
        expect(() =>
          Subject.validate({ ...VALID_INPUT, color: c }),
        ).not.toThrow();
      });
    });

    it('rejects invalid hex codes', () => {
      ['fff', '#ff', '#12345g', '#1234'].forEach((c) => {
        expect(isHexColor(c)).toBe(false);
        expect(() => Subject.validate({ ...VALID_INPUT, color: c })).toThrow();
      });
    });
  });

  describe('instance methods', () => {
    let subj: Subject;

    beforeEach(() => {
      subj = Subject.create(VALID_INPUT);
    });

    describe('changePriority()', () => {
      it('should update to a valid new priority', () => {
        subj.changePriority(7);
        expect(subj.priority).toBe(7);
      });

      it('should throw if new priority is out of range', () => {
        expect(() => subj.changePriority(0)).toThrow(
          /priority value between 1 and 10/,
        );
        expect(() => subj.changePriority(11)).toThrow(
          /priority value between 1 and 10/,
        );
      });
    });

    describe('updateDescription()', () => {
      it('should update to a valid new description', () => {
        const desc = 'New short description';
        subj.updateDescription(desc);
        expect(subj.description).toBe(desc);
      });

      it('should throw if description is too long', () => {
        const longDesc = 'x'.repeat(201);
        expect(() => subj.updateDescription(longDesc)).toThrow(
          /max length of 200/,
        );
      });
    });

    describe('updateTitle()', () => {
      it('should update to a valid new title', () => {
        const title = 'Another title';
        subj.updateTitle(title);
        expect(subj.title).toBe(title);
      });

      it('should throw if title is too long', () => {
        const longTitle = 'x'.repeat(61);
        expect(() => subj.updateTitle(longTitle)).toThrow(/max length of 60/);
      });
    });

    describe('updateColor()', () => {
      it('should update to a valid new color', () => {
        const color = '#123456';
        subj.updateColor(color);
        expect(subj.color).toBe(color);
      });

      it('should throw if color is invalid', () => {
        expect(() => subj.updateColor('not-a-color')).toThrow(/hex color code/);
      });
    });
  });
});
