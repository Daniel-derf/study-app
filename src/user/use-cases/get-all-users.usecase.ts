import { Inject } from '@nestjs/common';
import { IUserRepository } from '../repository/user.repository.interface';

export class GetAllUsersUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute() {
    const users = await this.userRepository.findAll();

    return users;
  }
}
