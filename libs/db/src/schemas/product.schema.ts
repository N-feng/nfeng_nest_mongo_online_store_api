import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { VariantType } from './variantType.schema';
import { Category } from './category.schema';
import { Brand } from './brand.schema';
import { SubCategory } from './subCategory.schema';

export type ProductDocument = Product & Document;

@Schema({
  timestamps: true,
})
export class Product extends Document {
  @Prop({
    type: String,
    required: [true, 'Name is required'], // Adding custom error message
    trim: true,
  })
  name: string;

  @Prop({
    type: String,
    trim: true,
  })
  description: string;

  @Prop({
    type: Number,
    trim: true,
  })
  quantity: number;

  @Prop({
    type: Number,
    trim: true,
  })
  price: number;

  @Prop({
    type: Number,
    trim: true,
  })
  offerPrice: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  proCategoryId: Category;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: true,
  })
  proSubCategoryId: SubCategory;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true,
  })
  proBrandId: Brand;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VariantType',
    required: true,
  })
  proVariantTypeId: VariantType;

  @Prop()
  proVariantId: string[];

  @Prop({
    type: [
      {
        image: {
          type: Number,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
  })
  images: any[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
