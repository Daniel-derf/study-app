const MIN_PRIORITY_VALUE = 0;
const MAX_PRIORITY_VALUE = 10;
const MAX_DESCRIPTION_VALUE = 200;
const MAX_TITLE_VALUE = 60;

export class Subject {
  title: string;
  description: string;
  priority: number;
  color: string;

  constructor(input: SubjectInput) {
    const isColorValid = this.isHexColor(input.color);

    const isValidPriority =
      input.priority > MIN_PRIORITY_VALUE &&
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

    this.title = input.title;
    this.description = input.description;
    this.priority = input.priority;
    this.color = input.color;
  }

  private isHexColor(str: string): boolean {
    const hexColorRegex = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
    return hexColorRegex.test(str);
  }
}

type SubjectInput = {
  title: string;
  description: string;
  priority: number;
  color: string;
};
