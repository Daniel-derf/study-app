import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangeUserNameDto {
  @ApiProperty({ example: 'Gabriel' })
  @IsString()
  name: string;
}
