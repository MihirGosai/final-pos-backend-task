import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = new this.productModel(createProductDto);
    return product.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid product ID format`);
    }

    const product = await this.productModel.findById(id).exec();

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid product ID format');
    }

    const updated = await this.productModel.findByIdAndUpdate(
      id,
      updateProductDto,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updated) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid product ID format');
    }

    const result = await this.productModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
  }
}
