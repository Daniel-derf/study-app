import { User } from '../entities/user.entity';

export interface IUserRepository {
  findById(userId: string): Promise<User>;
  findBy({ email }: { email: string }): Promise<User>;
  findAll(): Promise<User[]>;
  save(user: User, passwordHash?: string): Promise<void>;
  delete(userId: string): Promise<void>;
}
