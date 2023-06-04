import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class BaseProductDto {
  _id: string;

  @IsNotEmpty({ message: 'name is required' })
  @IsString({ message: 'name must be a string' })
  @ApiProperty({
    example: 'tomato',
    description: 'name of the product',
  })
  name: string;

  @IsNotEmpty({ message: 'category is required' })
  @IsString({ message: 'category must be a string' })
  @ApiProperty({
    example: 'vegetables',
    description: 'category of the product',
  })
  category: string;

  @IsNotEmpty({ message: 'unit is required' })
  @IsString({ message: 'unit must be a string' })
  @ApiProperty({
    example: 'kg',
    description: 'unit of measurement of the product',
  })
  unit: string;

  @IsNotEmpty({ message: 'suppliers is required' })
  @IsArray({ message: 'suppliers must be an array' })
  @ApiProperty({
    example: [
      {
        name: 'ali',
        price: 2020,
      },
    ],
    isArray: true,
    description: 'suppliers of the product',
  })
  readonly suppliers: Supplier[];

  @IsNotEmpty({ message: 'stock is required' })
  @IsPositive({ message: 'stock must be a positive number' })
  @ApiProperty({
    example: 13,
    description: 'stock of the product',
  })
  readonly stock: number;
}

class Supplier {
  @IsNotEmpty({ message: 'name is required' })
  @IsString({ message: 'name must be a string' })
  @ApiProperty({
    example: 'ali',
    description: 'name of the supplier',
  })
  name: string;

  @IsNotEmpty({ message: 'price is required' })
  @IsPositive({ message: 'price must be a positive number' })
  @ApiProperty({
    example: 2020,
    description: 'price of the supplier',
  })
  readonly price: number;
}
