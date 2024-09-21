import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { VariantType } from './variantType.schema';

export type VariantDocument = Variant & Document;

@Schema({
  timestamps: true,
})
export class Variant extends Document {
  @Prop({
    required: [true, 'Name is required'], // Adding custom error message
    trim: true,
  })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VariantType',
    required: [true, 'VariantType ID is required'],
  })
  variantTypeId: VariantType;
}

export const VariantSchema = SchemaFactory.createForClass(Variant);
