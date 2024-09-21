import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PosterDocument = Poster & Document;

@Schema({
  timestamps: true,
})
export class Poster extends Document {
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  posterName: string;

  @Prop({
    type: String,
    required: true,
  })
  imageUrl: string;
}

export const PosterSchema = SchemaFactory.createForClass(Poster);
