import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './schemas/cart.schema';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cart and adjust product stock' })
  @ApiResponse({ status: 201, description: 'Cart created successfully.' })
  async create(@Body() createCartDto: CreateCartDto): Promise<Cart> {
    return this.cartService.create(createCartDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all carts' })
  @ApiResponse({ status: 200, description: 'Returns all carts.' })
  async findAll(): Promise<Cart[]> {
    return this.cartService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cart by ID' })
  @ApiResponse({ status: 200, description: 'Returns a specific cart.' })
  async findOne(@Param('id') id: string): Promise<Cart> {
    return this.cartService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a cart by ID' })
  @ApiResponse({ status: 200, description: 'Cart updated successfully.' })
  async update(
    @Param('id') id: string,
    @Body() updateCartDto: UpdateCartDto,
  ): Promise<Cart> {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a cart by ID' })
  @ApiResponse({ status: 204, description: 'Cart deleted successfully.' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.cartService.remove(id);
  }

  @Delete(':cartId/items/:productId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a product from a cart' })
  @ApiResponse({ status: 200, description: 'Product removed from cart' })
  @ApiResponse({ status: 404, description: 'Cart or product not found' })
  async removeProductFromCart(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
  ): Promise<Cart> {
    return this.cartService.removeProductFromCart(cartId, productId);
  }
}
