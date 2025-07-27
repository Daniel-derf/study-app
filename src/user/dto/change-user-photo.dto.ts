import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangeUserPhotoDto {
  @ApiProperty({ example: 'www.img2.com' })
  @IsString()
  photoUrl: string;
}
