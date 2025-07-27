import { Inject } from '@nestjs/common';
import { IUserRepository } from '../repository/user.repository.interface';

export class ChangeUserNameUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: Input) {
    const user = await this.userRepository.findById(input.userId);

    user.changeName(input.name);

    await this.userRepository.save(user);

    return user;
  }
}

type Input = {
  userId: string;
  name: string;
};
