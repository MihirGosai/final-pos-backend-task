import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true, maxlength: 64 })
  name: string;

  @Prop({ maxlength: 2048 })
  description?: string;

  @Prop({ required: true })
  image: string; // base64 data URL, validate in DTO

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 0 })
  stock: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
