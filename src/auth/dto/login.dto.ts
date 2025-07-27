import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'mail@mail.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  password: string;
}
