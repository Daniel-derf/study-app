// __tests__/Subject.test.ts

import * as crypto from 'crypto';
import { Subject, SubjectInput } from './subject.entity';
import { isHexColor } from '../utils';

describe('Subject', () => {
  const VALID_INPUT: SubjectInput = {
    title: 'Valid title',
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
      const customInput = { ...VALID_INPUT, subjectId: 'custom-id' };
      const subj = Subject.create(customInput);
      expect(subj.subjectId).toBe('custom-id');
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
      // invalid color, priority out of range, etc.
      const badRecord: Required<SubjectInput> = {
        subjectId: 'x',
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
});
