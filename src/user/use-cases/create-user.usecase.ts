import { User } from '../entities/user.entity';
import { IUserRepository } from '../repository/user.repository.interface';

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: Input) {
    const user = User.create(input);

    await this.userRepository.save(user);

    return user;
  }
}

type Input = {
  name: string;
  profileImgUrl: string;
};
