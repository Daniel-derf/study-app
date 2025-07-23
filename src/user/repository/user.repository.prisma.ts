import { User } from '../entities/user.entity';
import { IUserRepository } from './user.repository.interface';

export class UserPrismaRepository implements IUserRepository {
  async findById(userId: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
  async findAll(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
  async save(user: User): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async delete(user: User): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
