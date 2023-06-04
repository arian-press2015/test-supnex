import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class UpdateProductDto {
  @IsNotEmpty({ message: 'stock is required' })
  @IsPositive({ message: 'stock must be a positive number' })
  @ApiProperty({
    example: 13,
    description: 'stock of the product',
  })
  readonly stock: number;
}
