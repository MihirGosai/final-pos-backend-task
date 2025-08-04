import {
  IsArray,
  IsDefined,
  IsMongoId,
  IsNotEmpty,
  IsString,
  ValidateNested,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class CartItemDto {
  @IsDefined({ message: 'productId is required' })
  @IsMongoId({ message: 'productId must be a valid Mongo ID' })
  productId: string;

  @IsDefined({ message: 'quantity is required' })
  @IsInt({ message: 'quantity must be an integer' })
  @Min(1, { message: 'quantity must be at least 1' })
  quantity: number;
}

export class CreateCartDto {
  @IsDefined({ message: 'userId is required' })
  @IsNotEmpty({ message: 'userId should not be empty' })
  @IsString({ message: 'userId must be a string' })
  userId: string;

  @IsDefined({ message: 'items are required' })
  @IsArray({ message: 'items must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}
