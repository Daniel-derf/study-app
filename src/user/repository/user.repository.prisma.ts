import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { User } from '../entities/user.entity';
import { IUserRepository } from './user.repository.interface';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBy({ email }: { email: string }): Promise<User> {
    const data = await this.prisma.user.findUnique({ where: { email } });

    if (!data) return null;

    const user = User.reconstitute(data);

    return user;
  }

  async findById(userId: string): Promise<User> {
    const data = await this.prisma.user.findUnique({ where: { userId } });

    if (!data) return null;

    const user = User.reconstitute(data);

    return user;
  }

  async findAll(): Promise<User[]> {
    const data = await this.prisma.user.findMany();

    const users = data.map(User.reconstitute);

    return users;
  }

  async save(user: User, passwordHash?: string): Promise<void> {
    const data = user.toPrimitives();

    await this.prisma.user.upsert({
      where: { userId: data.userId },
      update: {
        name: data.name,
        email: data.email,
        profileImgUrl: data.profileImgUrl,
        passwordHash,
      },
      create: {
        userId: data.userId,
        name: data.name,
        email: data.email,
        profileImgUrl: data.profileImgUrl,
        passwordHash: passwordHash ?? '',
      },
    });
  }

  async delete(userId: string): Promise<void> {
    await this.prisma.user.delete({ where: { userId } });
  }
}
