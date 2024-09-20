import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VariantTypeDocument = VariantType & Document;

@Schema({
  timestamps: true,
})
export class VariantType extends Document {
  @Prop({
    type: String,
    required: [true, 'Name is required'], // Adding custom error message
    trim: true,
  })
  name: string;

  @Prop({
    type: String,
    required: [true, 'Type is required'], // Adding custom error message
    trim: true,
  })
  type: string;
}

export const VariantTypeSchema = SchemaFactory.createForClass(VariantType);
