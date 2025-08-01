import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateSubjectDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsNumber()
  priority: number;

  @ApiProperty()
  @IsString()
  color: string;
}
