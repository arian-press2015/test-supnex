import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BaseProductDto {
  @IsNotEmpty({ message: 'title is required' })
  @IsString({ message: 'title must be a string' })
  @ApiProperty({
    example: 'residence-management',
    description: 'title of the Role',
  })
  title: string;
  description?: string;
}
