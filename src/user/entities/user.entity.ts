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

type UserInnerInput = {
  userId: string;
  name: Name;
  profileImgUrl: Url;
};

export class User {
  userId: string;

  name: Name;
  profileImgUrl: Url;

  private constructor(input: UserInnerInput) {
    this.userId = input.userId;
    this.name = input.name;
    this.profileImgUrl = input.profileImgUrl;
  }

  static create(input: UserInput) {
    const name = Name.create(input.name);
    const profileImgUrl = Url.create(input.profileImgUrl);
    const userId = randomUUID();

    return new User({ name, profileImgUrl, userId });
  }

  static reconstitute(input: UserInput) {
    const entityInput = {
      userId: input.userId,
      name: Name.reconstitute(input.name),
      profileImgUrl: Url.reconstitute(input.profileImgUrl),
    };

    return new User(entityInput);
  }

  toPrimitives() {
    return {
      userId: this.userId,
      name: this.name.name,
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
}

export type UserInput = {
  userId?: string;
  name: string;
  profileImgUrl: string;
};
