import { randomUUID } from 'crypto';
import { isHexColor } from '../utils';

const MIN_PRIORITY_VALUE = 1;
const MAX_PRIORITY_VALUE = 10;
const MAX_DESCRIPTION_VALUE = 200;
const MAX_TITLE_VALUE = 60;

export class Subject {
  subjectId: string;
  userId: string;
  title: string;
  description: string;
  priority: number;
  color: string;

  private constructor(input: SubjectInput) {
    this.subjectId = input.subjectId ?? randomUUID();
    this.title = input.title;
    this.description = input.description;
    this.priority = input.priority;
    this.color = input.color;
  }

  static create(input: SubjectInput): Subject {
    this.validate(input);

    return new Subject(input);
  }

  static reconstitute(record: SubjectInput): Subject {
    return new Subject(record);
  }

  static validate(input: SubjectInput): void {
    const isColorValid = isHexColor(input.color);

    const isValidPriority =
      input.priority >= MIN_PRIORITY_VALUE &&
      input.priority <= MAX_PRIORITY_VALUE;

    const isValidDescription = input.description.length < MAX_DESCRIPTION_VALUE;

    const isValidTitle = input.title.length < MAX_TITLE_VALUE;

    if (!isColorValid) {
      throw new Error('Invalid sent color. You have to send a hex color code.');
    }

    if (!isValidPriority) {
      throw new Error(
        `Invalid sent priority. You have to send a priority value between ${MIN_PRIORITY_VALUE} and ${MAX_PRIORITY_VALUE} `,
      );
    }

    if (!isValidDescription) {
      throw new Error(
        `Invalid sent description. You have to send a description with a max length of ${MAX_DESCRIPTION_VALUE}`,
      );
    }

    if (!isValidTitle) {
      throw new Error(
        `Invalid sent title. You have to send a title with a max length of ${MAX_TITLE_VALUE}`,
      );
    }
  }

  public changePriority(newPriority: number) {
    if (newPriority < MIN_PRIORITY_VALUE || newPriority > MAX_PRIORITY_VALUE)
      throw new Error(
        `Invalid sent priority. You have to send a priority value between ${MIN_PRIORITY_VALUE} and ${MAX_PRIORITY_VALUE} `,
      );

    this.priority = newPriority;
  }

  public updateDescription(newDescription: string) {
    const isValidDescription = newDescription.length < MAX_DESCRIPTION_VALUE;

    if (!isValidDescription)
      throw new Error(
        `Invalid sent description. You have to send a description with a max length of ${MAX_DESCRIPTION_VALUE}`,
      );

    this.description = newDescription;
  }

  public updateTitle(newTitle: string) {
    const isValidTitle = newTitle.length < MAX_TITLE_VALUE;

    if (!isValidTitle) {
      throw new Error(
        `Invalid sent title. You have to send a title with a max length of ${MAX_TITLE_VALUE}`,
      );
    }

    this.title = newTitle;
  }

  public updateColor(newColor: string) {
    const isColorValid = isHexColor(newColor);

    if (!isColorValid) {
      throw new Error('Invalid sent color. You have to send a hex color code.');
    }

    this.color = newColor;
  }
}

export type SubjectInput = {
  subjectId?: string;
  title: string;
  description: string;
  priority: number;
  color: string;
};
