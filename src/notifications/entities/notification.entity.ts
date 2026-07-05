// Notification Entity - Notifications ke liye MongoDB schema
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification extends Document {
  // Notification ID - MongoDB automatically generates this
  _id: string;

  // User ID - jis user ke liye notification hai
  @Prop({ required: true })
  userId: string;

  // Title - notification ka heading
  @Prop({ required: true })
  title: string;

  // Message - notification ka detailed message
  @Prop({ required: true })
  message: string;

  // Type - notification ka type (e.g., "appointment", "chat", "system")
  @Prop({ required: true })
  type: string;

  // Icon - icon ka naam (e.g., "calendar", "message", "bell")
  @Prop({ required: true })
  icon: string;

  // Icon color - icon ka color (hex code)
  @Prop({ required: true })
  iconColor: string;

  // Icon background color - icon ka background color (hex code)
  @Prop({ required: true })
  iconBackgroundColor: string;

  // Kya notification padha gaya hai
  @Prop({ default: false })
  isRead: boolean;

  // Related data - additional data (e.g., appointment ID, message ID)
  @Prop()
  relatedId?: string;

  // Created at timestamp (auto-generated)
  createdAt: Date;

  // Updated at timestamp (auto-generated)
  updatedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
