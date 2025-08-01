import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Log In with email and password' })
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    const jwt = await this.authService.login(dto);

    return { data: { jwt } };
  }

  @ApiOperation({ summary: 'Recover password with email' })
  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassoword(dto);

    return { message: 'A recovery email was sent to your email' };
  }

  @ApiOperation({ summary: 'Confirm registered email passing the code' })
  @Post('confirm-email')
  @HttpCode(200)
  async confirmEmail(@Body() dto: ConfirmEmailDto) {
    await this.authService.confirmEmail(dto);

    return { message: 'Email confirmed successfully' };
  }
}
