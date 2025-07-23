import { IUserRepository } from '../repository/user.repository.interface';

export class ChangeUserPhotoUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: Input) {
    const user = await this.userRepository.findById(input.userId);

    user.changeImage(input.photoUrl);

    await this.userRepository.save(user);

    return user;
  }
}

type Input = {
  userId: string;
  photoUrl: string;
};
