import { Controller, Post, Body, Param } from '@nestjs/common';
import { ChangeUserNameUseCase } from './use-cases/change-username.usecase';
import { ChangeUserPhotoUseCase } from './use-cases/change-user-photo.usecase';
import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangeUserPhotoDto } from './dto/change-user-photo.dto';
import { ChangeUserNameDto } from './dto/change-username.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly changeUserNameUseCase: ChangeUserNameUseCase,
    private readonly changeUserPhotoUseCase: ChangeUserPhotoUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute({
      name: dto.name,
      profileImgUrl: dto.profileImgUrl,
    });
  }

  @Post(':userId/change-name')
  async changeName(
    @Param('userId') userId: string,
    @Body() dto: ChangeUserNameDto,
  ) {
    return this.changeUserNameUseCase.execute({
      userId,
      name: dto.name,
    });
  }

  @Post(':userId/change-photo')
  async changePhoto(
    @Param('userId') userId: string,
    @Body() dto: ChangeUserPhotoDto,
  ) {
    return this.changeUserPhotoUseCase.execute({
      userId,
      photoUrl: dto.photoUrl,
    });
  }
}
