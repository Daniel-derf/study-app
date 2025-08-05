import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'mail@mail.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'Roger' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'www.img.com' })
  @IsOptional()
  @IsString()
  profileImgUrl: string;
}
