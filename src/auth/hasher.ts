import * as bcrypt from 'bcrypt';

export class BcryptHasher {
  private readonly SALT_ROUNDS = 10;

  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.SALT_ROUNDS);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
