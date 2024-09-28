import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({
  timestamps: true,
})
export class Notification extends Document {
  @Prop({
    type: String,
    required: [true, 'Notification ID is required'],
    unique: true,
  })
  notificationId: string;

  @Prop({
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  })
  title: string;

  @Prop({
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  })
  description: string;

  @Prop({
    type: String,
    trim: true,
  })
  imageUrl: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
