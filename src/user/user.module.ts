import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { ChangeUserNameUseCase } from './use-cases/change-username.usecase';
import { ChangeUserPhotoUseCase } from './use-cases/change-user-photo.usecase';
import { UserPrismaRepository } from './repository/user.repository.prisma';
import { PrismaService } from '../database/prisma.service';
import { GetAllUsersUseCase } from './use-cases/get-all-users.usecase';

@Module({
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    ChangeUserNameUseCase,
    ChangeUserPhotoUseCase,
    GetAllUsersUseCase,
    { provide: 'IUserRepository', useClass: UserPrismaRepository },
    PrismaService,
  ],
})
export class UserModule {}
