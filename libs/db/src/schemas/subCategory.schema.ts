import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Category } from './category.schema';

export type SubCategoryDocument = SubCategory & Document;

@Schema({
  timestamps: true,
})
export class SubCategory extends Document {
  @Prop({
    type: String,
    required: [true, 'Name is required'], // Adding custom error message
    trim: true,
  })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category ID is required'],
  })
  categoryId: Category;
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
