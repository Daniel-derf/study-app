import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<{
    accessToken: string;
    user: {
      id: string;
      email: string;
      name: string;
      profileImgUrl: string;
    };
  }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.userId,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.userId,
        email: user.email,
        name: user.name,
        profileImgUrl: user.profileImgUrl,
      },
    };
  }

  async forgotPassoword(dto: ForgotPasswordDto) {
    console.log(dto);
    // Em branco por enquanto
  }

  async confirmEmail(dto: ConfirmEmailDto) {
    console.log(dto);
    // Em branco por enquanto
  }
}
