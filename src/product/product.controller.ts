import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BaseProductDto } from './dto/base-product.dto';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Create new Product' })
  @ApiResponse({
    status: 201,
    description: 'Creates a new Product',
    type: BaseProductDto,
  })
  /** It doesn't allow me to have multiple 400 status codes so I wrote all in one */
  @ApiResponse({
    status: 400,
    description:
      'product already exists|name must be a string|category must be a string|unit must be a string|name is required|category is required' +
      '|unit is required|suppliers must be an array|suppliers is required|stock must be a positive number|stock is required|price must be a positive number|price is required',
  })
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @ApiOperation({ summary: 'Return all Products' })
  @ApiResponse({
    status: 200,
    description: 'Returns all Products',
    type: [BaseProductDto],
  })
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @ApiOperation({ summary: 'Return a Product' })
  @ApiResponse({
    status: 200,
    description: 'Returns a Product',
    type: BaseProductDto,
  })
  @ApiResponse({
    status: 400,
    description: 'product not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a Product' })
  @ApiResponse({
    status: 200,
    description: 'Updates a Product',
    type: BaseProductDto,
  })
  /** It doesn't allow me to have multiple 400 status codes so I wrote all in one */
  @ApiResponse({
    status: 400,
    description:
      'product not found|stock must be a positive number|stock is required',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @ApiOperation({ summary: 'Delete a Product' })
  @ApiResponse({
    status: 200,
    description: 'Deletes a Product',
    type: BaseProductDto,
  })
  @ApiResponse({
    status: 400,
    description: 'product not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
