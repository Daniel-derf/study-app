import { BadRequestException, Inject } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { IUserRepository } from '../repository/user.repository.interface';
import { BcryptHasher } from '../../auth/hasher';

export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,

    private readonly hasher: BcryptHasher,
  ) {}

  async execute(input: Input) {
    const alreadyExists = await this.userRepository.findBy({
      email: input.email,
    });

    if (alreadyExists) throw new BadRequestException('User already exists');

    const user = User.create(input);
    const passwordHash = await this.hasher.hash(input.password);

    await this.userRepository.save(user, passwordHash);

    return user.toPrimitives();
  }
}

type Input = {
  name: string;
  password: string;
  email: string;
  profileImgUrl: string;
};
