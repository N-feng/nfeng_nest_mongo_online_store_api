import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Category } from './category.schema';
import { Product } from './product.schema';

export type CouponDocument = Coupon & Document;

@Schema({
  timestamps: true,
})
export class Coupon extends Document {
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  couponCode: string;

  @Prop({
    type: String,
    enum: ['fixed', 'percentage'],
    required: true,
  })
  discountType: string;

  @Prop({
    type: Number,
    required: true,
  })
  discountAmount: number;

  @Prop({
    type: Number,
    required: true,
  })
  minimumPurchaseAmount: number;

  @Prop({
    type: Date,
    required: true,
  })
  endDate;

  @Prop({
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  })
  applicableCategory: Category;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
  })
  applicableSubCategory: Category;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  })
  applicableProduct: Product;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
