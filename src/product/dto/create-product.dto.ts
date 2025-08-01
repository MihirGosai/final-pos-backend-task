import {
  IsString,
  IsOptional,
  MaxLength,
  IsNumber,
  Min,
  Matches,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(64)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  description?: string;

  @IsString()
  @Matches(/^data:image\/(png|jpeg|jpg);base64,/, {
    message: 'image must be a base64 data URL less than 1MB',
  })
  image: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;
}
