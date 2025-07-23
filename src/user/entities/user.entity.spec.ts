import { Name, Url, User } from './user.entity';

describe('User Aggregate', () => {
  const validName = 'Alice';
  const validUrl = 'https://example.com/avatar.png';
  const invalidName = 'Al';
  const invalidUrl = 'not-a-url';

  test('create should instantiate', () => {
    const user = User.create({ name: validName, profileImgUrl: validUrl });
    expect(user).toBeInstanceOf(User);
    expect(user.name).toBeInstanceOf(Name);
    expect(user.name.name).toBe(validName);
    expect(user.profileImgUrl).toBeInstanceOf(Url);
    expect(user.profileImgUrl.url).toBe(validUrl);
  });

  test('changeName should update name on valid input', () => {
    const user = User.create({ name: validName, profileImgUrl: validUrl });
    user.changeName('Bob');
    expect(user.name.name).toBe('Bob');
  });

  test('changeName should throw on invalid input', () => {
    const user = User.create({ name: validName, profileImgUrl: validUrl });
    expect(() => user.changeName(invalidName)).toThrow(Error('Invalid name'));
  });

  test('changeImage should update profileImgUrl on valid input', () => {
    const user = User.create({ name: validName, profileImgUrl: validUrl });
    const newUrl = 'http://new.example.com/pic.png';
    user.changeImage(newUrl);
    expect(user.profileImgUrl.url).toBe(newUrl);
  });

  test('changeImage should throw on invalid input', () => {
    const user = User.create({ name: validName, profileImgUrl: validUrl });
    expect(() => user.changeImage(invalidUrl)).toThrow(
      Error('Invalid Profile Image URL'),
    );
  });

  test('create should throw when name invalid', () => {
    expect(() =>
      User.create({ name: invalidName, profileImgUrl: validUrl }),
    ).toThrow(Error('Invalid name'));
  });

  test('create should throw when url invalid', () => {
    expect(() =>
      User.create({ name: validName, profileImgUrl: invalidUrl }),
    ).toThrow(Error('Invalid Profile Image URL'));
  });
});
