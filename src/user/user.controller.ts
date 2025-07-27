import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ChangeUserNameUseCase } from './use-cases/change-username.usecase';
import { ChangeUserPhotoUseCase } from './use-cases/change-user-photo.usecase';
import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangeUserPhotoDto } from './dto/change-user-photo.dto';
import { ChangeUserNameDto } from './dto/change-username.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAllUsersUseCase } from './use-cases/get-all-users.usecase';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly changeUserNameUseCase: ChangeUserNameUseCase,
    private readonly changeUserPhotoUseCase: ChangeUserPhotoUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
  ) {}

  @ApiOperation({ summary: 'Create a new user' })
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute({
      name: dto.name,
      profileImgUrl: dto.profileImgUrl,
    });
  }

  @ApiOperation({ summary: 'Change the name of one user' })
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

  @ApiOperation({ summary: 'Change the photo of one user' })
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

  @ApiOperation({ summary: 'Get all Users' })
  @Get('')
  async getAllUsers() {
    const users = (await this.getAllUsersUseCase.execute()).map((u) =>
      u.toPrimitives(),
    );

    return users;
  }
}
