import { User } from '../entities/user.entity';

export interface IUserRepository {
  findById(userId: string): Promise<User>;
  findAll(): Promise<User[]>;
  save(user: User): Promise<void>;
  delete(user: User): Promise<void>;
}
