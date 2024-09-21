import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PhotoDocument = Photo & Document;

@Schema({
  timestamps: true,
})
export class Photo extends Document {
  @Prop({
    required: true,
  })
  image: number;

  @Prop({
    required: true,
  })
  url: string;
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);
