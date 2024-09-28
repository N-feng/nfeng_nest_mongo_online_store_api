import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user';

export type OrderDocument = Order & Document;

@Schema({
  timestamps: true,
})
export class Order extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true, // Adding custom error message
    ref: 'User',
  })
  userID: User;

  @Prop({
    type: Date,
    default: Date.now,
  })
  orderDate;

  @Prop({
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  })
  orderStatus: string;

  @Prop({
    type: [
      {
        productID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        productName: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        variant: {
          type: String,
        },
      },
    ],
  })
  items: [];

  @Prop({
    type: Number,
    required: true,
  })
  totalPrice: number;

  @Prop({
    type: {
      phone: String,
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
  })
  shippingAddress;

  @Prop({
    type: String,
    enum: ['cod', 'prepaid'],
  })
  paymentMethod: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
  })
  couponCode: string;

  @Prop({
    type: {
      subtotal: Number,
      discount: Number,
      total: Number,
    },
  })
  orderTotal;

  @Prop({
    type: String,
  })
  trackingUrl: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
