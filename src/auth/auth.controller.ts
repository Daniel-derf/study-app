import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Route to login' })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const jwt = await this.authService.login(dto);

    return { data: { jwt } };
  }

  @ApiOperation({ summary: 'Route to recover password through email' })
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassoword(dto);

    return { message: 'A recovery email was sent to your email' };
  }

  @ApiOperation({ summary: 'Route to confirm registered email' })
  @Post('confirm-email')
  async confirmEmail(@Body() dto: ConfirmEmailDto) {
    await this.authService.confirmEmail(dto);

    return { message: 'Email confirmed successfully' };
  }
}
