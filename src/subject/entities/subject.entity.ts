import { randomUUID } from 'crypto';

const MIN_PRIORITY_VALUE = 1;
const MAX_PRIORITY_VALUE = 10;
const MAX_DESCRIPTION_VALUE = 200;
const MAX_TITLE_VALUE = 60;

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

// Value Objects
class Color {
  colorCode: string;

  private constructor({ colorCode }: ColorInput) {
    this.colorCode = colorCode;
  }

  static create(input: ColorInput) {
    const isColorValid = this.isHexColor(input.colorCode);

    if (!isColorValid) throw new Error('Invalid color hex code');

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
  priority: number;

  private constructor({ priority }: PriorityInput) {
    this.priority = priority;
  }

  static create({ priority }: PriorityInput) {
    const isValidPriority =
      priority >= MIN_PRIORITY_VALUE && priority <= MAX_PRIORITY_VALUE;

    if (!isValidPriority) throw new Error('Invalid priority.');

    return new Priority({ priority });
  }
}

class Title {
  title: string;

  private constructor({ title }: TitleInput) {
    this.title = title;
  }

  static create({ title }: TitleInput) {
    const isValidTitle = title.length < MAX_TITLE_VALUE;

    if (!isValidTitle) {
      throw new Error(`Invalid sent title.`);
    }

    return new Title({ title });
  }
}

class Description {
  description: string;

  private constructor({ description }: DescriptionInput) {
    this.description = description;
  }

  static create({ description }: DescriptionInput) {
    const isValidDescription = description.length < MAX_DESCRIPTION_VALUE;

    if (!isValidDescription) {
      throw new Error(`Invalid description.`);
    }

    return new Description({ description });
  }
}

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
      title: Title.create({ title: record.title }),
      description: Description.create({ description: record.description }),
      color: Color.create({ colorCode: record.color }),
      priority: Priority.create({ priority: record.priority }),
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

export type SubjectInput = {
  subjectId?: string;
  userId: string;
  title: string;
  description: string;
  priority: number;
  color: string;
};
