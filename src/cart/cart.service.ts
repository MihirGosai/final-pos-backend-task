import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import axios from 'axios';
import { ProductResponse } from '../common/types/product-response.interface';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) {}

  // Create a new cart and validate products
  async create(createCartDto: CreateCartDto): Promise<Cart> {
    for (const item of createCartDto.items) {
      const response = await axios.get<ProductResponse>(
        `http://localhost:3000/products/${item.productId}`,
      );
      const product = response.data;

      if (!product || product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${item.productId}`,
        );
      }

      // Optionally update stock (example PUT request)
      await axios.put(`http://localhost:3000/products/${item.productId}`, {
        stock: product.stock - item.quantity,
      });
    }

    const cart = new this.cartModel(createCartDto);
    return cart.save();
  }

  // Get all carts
  async findAll(): Promise<Cart[]> {
    return this.cartModel.find().populate('items.productId').exec();
  }

  // Get a single cart by ID
  async findOne(id: string): Promise<Cart> {
    const cart = await this.cartModel
      .findById(id)
      .populate('items.productId')
      .exec();

    if (!cart) {
      throw new NotFoundException(`Cart with ID "${id}" not found`);
    }

    return cart;
  }

  // Update cart (without rechecking stock for simplicity)
  async update(id: string, updateCartDto: UpdateCartDto): Promise<Cart> {
    const cart = await this.cartModel.findByIdAndUpdate(id, updateCartDto, {
      new: true,
      runValidators: true,
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID "${id}" not found`);
    }

    return cart;
  }

  // Delete a cart
  async remove(id: string): Promise<void> {
    const result = await this.cartModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Cart with ID "${id}" not found`);
    }
  }
}
