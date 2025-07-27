import { BadRequestException, Inject } from '@nestjs/common';
import { IUserRepository } from '../repository/user.repository.interface';

export class ChangeUserPhotoUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: Input) {
    const user = await this.userRepository.findById(input.userId);

    if (!user) throw new BadRequestException('User does not exist');

    user.changeImage(input.photoUrl);

    await this.userRepository.save(user);

    return user;
  }
}

type Input = {
  userId: string;
  photoUrl: string;
};
