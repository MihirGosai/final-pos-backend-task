import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
    let total = 0;

    for (const item of createCartDto.items) {
      let product: ProductResponse;
      try {
        const response = await axios.get<ProductResponse>(
          `http://localhost:3000/products/${item.productId}`,
        );
        product = response.data;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        throw new BadRequestException(
          `Product with ID "${item.productId}" not found.`,
        );
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`,
        );
      }

      total += product.price * item.quantity;

      await axios.put(`http://localhost:3000/products/${item.productId}`, {
        stock: product.stock - item.quantity,
      });
    }

    const cart = new this.cartModel({
      userId: createCartDto.userId,
      items: createCartDto.items,
      total,
    });

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

  // Update cart and re-validate products
  async update(id: string, updateCartDto: UpdateCartDto): Promise<Cart> {
    const existing = await this.cartModel.findById(id).exec();

    if (!existing) {
      throw new NotFoundException(`Cart with ID "${id}" not found`);
    }

    let total = existing.total;

    // Re-validate items if provided
    if (updateCartDto.items) {
      total = 0;

      for (const item of updateCartDto.items as {
        productId: string;
        quantity: number;
      }[]) {
        let product: ProductResponse;

        try {
          const response = await axios.get<ProductResponse>(
            `http://localhost:3000/products/${item.productId}`,
          );
          product = response.data;
        } catch (err) {
          throw new BadRequestException(
            `Product with ID "${item.productId}" not found`,
          );
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`,
          );
        }

        total += product.price * item.quantity;

        await axios.put(`http://localhost:3000/products/${item.productId}`, {
          stock: product.stock - item.quantity,
        });
      }

      // Safe ObjectId assignment
      existing.items = updateCartDto.items.map((item) => ({
        productId: new Types.ObjectId(item.productId),
        quantity: item.quantity,
      }));
    }

    if (updateCartDto.userId) {
      existing.userId = updateCartDto.userId;
    }

    existing.total = total;

    return existing.save();
  }
  // Delete a cart
  async remove(id: string): Promise<void> {
    const result = await this.cartModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Cart with ID "${id}" not found`);
    }
  }
}
