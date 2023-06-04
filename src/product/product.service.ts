import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly model: Model<ProductDocument>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.model.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    const exists = await this.model.findById(id).exec();
    if (!exists) {
      throw new NotFoundException('product not found');
    }
    return exists;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return await this.model.create({
      ...createProductDto,
      createdAt: new Date(),
    });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const exists = await this.model.findById(id).exec();
    if (!exists) {
      throw new NotFoundException('product not found');
    }

    return await this.model
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Product> {
    const exists = await this.model.findById(id).exec();
    if (!exists) {
      throw new NotFoundException('product not found');
    }
    return await this.model.findByIdAndDelete(id).exec();
  }
}
