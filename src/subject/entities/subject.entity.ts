import { randomUUID } from 'crypto';
import { DomainError } from '../../common/domain.error';

// Types
type ColorInput = {
  colorCode: string;
};

type SubjectEntityInput = {
  subjectId?: string;
  userId: string;
  color: Color;
  title: Title;
  description: Description;
  priority: Priority;
};

type PriorityInput = {
  priority: number;
};

type TitleInput = {
  title: string;
};

type DescriptionInput = {
  description: string;
};

export type SubjectInput = {
  subjectId?: string;
  userId: string;
  title: string;
  description: string;
  priority: number;
  color: string;
};

// Value Objects
class Color {
  colorCode: string;

  private constructor({ colorCode }: ColorInput) {
    this.colorCode = colorCode;
  }

  static create(input: ColorInput) {
    const isColorValid = this.isHexColor(input.colorCode);

    if (!isColorValid) throw new DomainError('Invalid color hex code');

    return new Color(input);
  }

  static reconstitute(input: ColorInput) {
    return new Color(input);
  }

  static isHexColor(str: string): boolean {
    const hexColorRegex = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
    return hexColorRegex.test(str);
  }
}

class Priority {
  static MIN_VALUE = 1;
  static MAX_VALUE = 10;

  priority: number;

  private constructor({ priority }: PriorityInput) {
    this.priority = priority;
  }

  static create({ priority }: PriorityInput) {
    const isValidPriority =
      priority >= this.MIN_VALUE &&
      priority <= this.MAX_VALUE &&
      typeof priority === 'number';

    if (!isValidPriority) throw new DomainError('Invalid priority.');

    return new Priority({ priority });
  }

  static reconstitute({ priority }: PriorityInput) {
    return new Priority({ priority });
  }
}

class Title {
  static MAX_LENGTH = 60;
  static MIN_LENGTH = 2;

  title: string;

  private constructor({ title }: TitleInput) {
    this.title = title;
  }

  static create({ title }: TitleInput) {
    const isValidTitle =
      title.length >= this.MIN_LENGTH &&
      title.length <= this.MAX_LENGTH &&
      typeof title === 'string';

    if (!isValidTitle) {
      throw new DomainError(`Invalid sent title.`);
    }

    return new Title({ title });
  }

  static reconstitute({ title }: TitleInput) {
    return new Title({ title });
  }
}

class Description {
  static MIN_LENGTH = 5;
  static MAX_LENGTH = 200;

  description: string;

  private constructor({ description }: DescriptionInput) {
    this.description = description;
  }

  static create({ description }: DescriptionInput) {
    const isValidDescription =
      description.length >= this.MIN_LENGTH &&
      description.length <= this.MAX_LENGTH &&
      typeof description === 'string';

    if (!isValidDescription) {
      throw new DomainError(`Invalid description.`);
    }

    return new Description({ description });
  }

  static reconstitute({ description }: DescriptionInput) {
    return new Description({ description });
  }
}

// Entities
export class Subject {
  subjectId: string;
  userId: string;
  title: Title;
  description: Description;
  priority: Priority;
  color: Color;

  private constructor(input: SubjectEntityInput) {
    this.subjectId = input.subjectId ?? randomUUID();
    this.title = input.title;
    this.description = input.description;
    this.priority = input.priority;
    this.color = input.color;
    this.userId = input.userId;
  }

  static create(input: SubjectInput): Subject {
    const color = Color.create({ colorCode: input.color });
    const priority = Priority.create({ priority: input.priority });
    const title = Title.create({ title: input.title });
    const description = Description.create({ description: input.description });

    const constructorInput: SubjectEntityInput = {
      color,
      userId: input.userId,
      title,
      description,
      priority,
    };

    return new Subject(constructorInput);
  }

  static reconstitute(record: SubjectInput): Subject {
    const subjectInput: SubjectEntityInput = {
      userId: record.userId,
      title: Title.reconstitute({ title: record.title }),
      description: Description.reconstitute({
        description: record.description,
      }),
      color: Color.reconstitute({ colorCode: record.color }),
      priority: Priority.reconstitute({ priority: record.priority }),
    };

    return new Subject(subjectInput);
  }

  public changePriority(newPriority: number) {
    const priority = Priority.create({ priority: newPriority });

    this.priority = priority;
  }

  public updateDescription(newDescription: string) {
    const description = Description.create({ description: newDescription });

    this.description = description;
  }

  public updateTitle(newTitle: string) {
    const title = Title.create({ title: newTitle });

    this.title = title;
  }

  public updateColor(newColor: string) {
    const color = Color.create({ colorCode: newColor });

    this.color = color;
  }
}
