import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';

@Injectable()
export class AuthService {
  constructor() {}

  async login(dto: LoginDto) {}

  // async register(dto: ) {}

  async forgotPassoword(dto: ForgotPasswordDto) {}

  async confirmEmail(dto: ConfirmEmailDto) {}
}
