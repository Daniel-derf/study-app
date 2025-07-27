import { randomUUID } from 'crypto';

export class Name {
  name: string;

  private constructor(name: string) {
    this.name = name;
  }

  static create(name: string) {
    if (name.length < 3 || name.length > 100) {
      throw new Error('Invalid name');
    }

    return new Name(name);
  }

  static reconstitute(name: string) {
    return new Name(name);
  }
}

export class Url {
  url: string;

  private constructor(url: string) {
    this.url = url;
  }

  private static isValidUrl(url) {
    const pattern = new RegExp(
      '^' +
        '(https?:\\/\\/)?' +
        '((\\S+):(\\S+)@)?' +
        '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+' +
        '[a-zA-Z]{2,}|' +
        '((25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}' +
        '(25[0-5]|2[0-4]\\d|[01]?\\d?\\d))' +
        '(\\:\\d{2,5})?' +
        '(\\/[^\\s]*)?' +
        '$',
      'i',
    );
    return pattern.test(url);
  }

  static create(url: string) {
    if (!this.isValidUrl(url)) {
      throw new Error('Invalid Profile Image URL');
    }

    return new Url(url);
  }

  static reconstitute(url: string) {
    return new Url(url);
  }
}

export class Email {
  readonly value: string;

  private constructor(email: string) {
    this.value = email;
  }

  static create(email: string): Email {
    const normalized = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalized)) {
      throw new Error('Invalid email');
    }

    return new Email(normalized);
  }

  static reconstitute(email: string): Email {
    return new Email(email);
  }
}

type UserInnerInput = {
  userId: string;
  name: Name;
  profileImgUrl: Url;
  email: Email;
};

export class User {
  userId: string;
  name: Name;
  email: Email;
  profileImgUrl: Url;

  private constructor(input: UserInnerInput) {
    this.userId = input.userId;
    this.name = input.name;
    this.profileImgUrl = input.profileImgUrl;
    this.email = input.email;
  }

  static create(input: UserInput) {
    const name = Name.create(input.name);
    const email = Email.create(input.email);
    const profileImgUrl = Url.create(input.profileImgUrl);
    const userId = randomUUID();

    return new User({ name, profileImgUrl, userId, email });
  }

  static reconstitute(input: UserInput) {
    const entityInput = {
      userId: input.userId,
      name: Name.reconstitute(input.name),
      profileImgUrl: Url.reconstitute(input.profileImgUrl),
      email: Email.reconstitute(input.email),
    };

    return new User(entityInput);
  }

  toPrimitives() {
    return {
      userId: this.userId,
      name: this.name.name,
      email: this.email.value,
      profileImgUrl: this.profileImgUrl.url,
    };
  }

  changeName(newName: string) {
    const name = Name.create(newName);

    this.name = name;
  }

  changeImage(newUrl: string) {
    const url = Url.create(newUrl);

    this.profileImgUrl = url;
  }

  changeEmail(newEmail: string) {
    const email = Email.create(newEmail);

    this.email = email;
  }
}

export type UserInput = {
  userId?: string;
  name: string;
  email: string;
  profileImgUrl: string;
};
