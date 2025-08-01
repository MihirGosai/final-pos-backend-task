import {
  IsString,
  IsArray,
  ValidateNested,
  IsMongoId,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class CartItemDto {
  @IsMongoId()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateCartDto {
  @IsString()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}
