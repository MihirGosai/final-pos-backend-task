import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDefined,
  MaxLength,
  Matches,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsDefined({ message: 'name is required' })
  @IsNotEmpty({ message: 'name should not be empty' })
  @IsString({ message: 'name must be a string' })
  @MaxLength(64, {
    message: 'name must be shorter than or equal to 64 characters',
  })
  name: string;

  @IsOptional()
  @IsString({ message: 'description must be a string' })
  @MaxLength(2048, {
    message: 'description must be shorter than or equal to 2048 characters',
  })
  description?: string;

  @IsDefined({ message: 'image is required' })
  @IsNotEmpty({ message: 'image should not be empty' })
  @IsString({ message: 'image must be a string' })
  @Matches(/^data:image\/(png|jpeg|jpg);base64,/, {
    message: 'image must be a base64 data URL less than 1MB',
  })
  image: string;

  @IsDefined({ message: 'price is required' })
  @IsNumber({}, { message: 'price must be a number' })
  @Min(0, { message: 'price must not be less than 0' })
  price: number;

  @IsDefined({ message: 'stock is required' })
  @IsNumber({}, { message: 'stock must be a number' })
  @Min(0, { message: 'stock must not be less than 0' })
  stock: number;
}
