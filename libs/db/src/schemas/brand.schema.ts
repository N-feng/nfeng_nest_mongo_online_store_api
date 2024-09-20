import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { SubCategory } from './subCategory.schema';

export type BrandDocument = Brand & Document;

@Schema({
  timestamps: true,
})
export class Brand extends Document {
  @Prop({
    type: String,
    required: [true, 'Name is required'], // Adding custom error message
    trim: true,
  })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: [true, 'SubCategory ID is required'],
  })
  subcategoryId: SubCategory;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
