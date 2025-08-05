import { Email, Name, Url, User } from './user.entity';

describe('User Aggregate', () => {
  const validName = 'Alice';
  const validUrl = 'https://example.com/avatar.png';
  const invalidName = 'Al';
  const invalidUrl = 'not-a-url';
  const invalidEmail = 'daniel.com';
  const validEmail = 'daniel@gmail.com';

  test('create should instantiate', () => {
    const user = User.create({
      name: validName,
      profileImgUrl: validUrl,
      email: validEmail,
    });

    expect(user).toBeInstanceOf(User);
    expect(user.name).toBeInstanceOf(Name);
    expect(user.name.name).toBe(validName);
    expect(user.profileImgUrl).toBeInstanceOf(Url);
    expect(user.profileImgUrl.url).toBe(validUrl);
    expect(user.email).toBeInstanceOf(Email);
    expect(user.email.value).toBe(validEmail);
  });

  test('changeName should update name on valid input', () => {
    const user = User.create({
      name: validName,
      profileImgUrl: validUrl,
      email: validEmail,
    });
    user.changeName('Bob');
    expect(user.name.name).toBe('Bob');
  });

  test('changeName should throw on invalid input', () => {
    const user = User.create({
      name: validName,
      profileImgUrl: validUrl,
      email: validEmail,
    });
    expect(() => user.changeName(invalidName)).toThrow(Error('Invalid name'));
  });

  test('change email should update email on valid input', () => {
    const user = User.create({
      name: validName,
      profileImgUrl: validUrl,
      email: validEmail,
    });

    const newValidEmail = 'valid@gmail.com';

    let userData = user.toJSON();
    expect(userData.email).toBe(validEmail);

    user.changeEmail(newValidEmail);

    userData = user.toJSON();
    expect(userData.email).toBe(newValidEmail);
  });

  test('change email should throw when email invalid', () => {
    const user = User.create({
      email: validEmail,
      name: validName,
      profileImgUrl: validUrl,
    });

    expect(() => user.changeEmail(invalidEmail)).toThrow(
      Error('Invalid email'),
    );
  });

  test('changeImage should update profileImgUrl on valid input', () => {
    const user = User.create({
      name: validName,
      profileImgUrl: validUrl,
      email: validEmail,
    });
    const newUrl = 'http://new.example.com/pic.png';
    user.changeImage(newUrl);
    expect(user.profileImgUrl.url).toBe(newUrl);
  });

  test('changeImage should throw on invalid input', () => {
    const user = User.create({
      name: validName,
      profileImgUrl: validUrl,
      email: validEmail,
    });
    expect(() => user.changeImage(invalidUrl)).toThrow(
      Error('Invalid Profile Image URL'),
    );
  });

  test('create should throw when name invalid', () => {
    expect(() =>
      User.create({
        name: invalidName,
        profileImgUrl: validUrl,
        email: validEmail,
      }),
    ).toThrow(Error('Invalid name'));
  });

  test('create should throw when url invalid', () => {
    expect(() =>
      User.create({
        name: validName,
        profileImgUrl: invalidUrl,
        email: validEmail,
      }),
    ).toThrow(Error('Invalid Profile Image URL'));
  });

  test('create should throw when email invalid', () => {
    expect(() =>
      User.create({
        name: validName,
        email: invalidEmail,
        profileImgUrl: validUrl,
      }),
    ).toThrow(Error('Invalid email'));
  });
});
