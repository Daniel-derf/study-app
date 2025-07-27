import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(dto: LoginDto) {}

  // async register(dto: ) {}

  async forgotPassoword(dto: ForgotPasswordDto) {}

  async confirmEmail(dto: ConfirmEmailDto) {}
}
