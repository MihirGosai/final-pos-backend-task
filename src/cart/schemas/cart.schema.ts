import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ required: true })
  userId: string;

  @Prop({
    type: [
      {
        productId: { type: Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
  })
  items: {
    productId: Types.ObjectId;
    quantity: number;
  }[];

  @Prop({ required: true })
  total: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
