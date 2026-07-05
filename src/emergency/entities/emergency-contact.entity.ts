// Emergency Contact Entity - Emergency contacts ke liye MongoDB schema
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmergencyContactDocument = EmergencyContact & Document;

@Schema({ timestamps: true })
export class EmergencyContact extends Document {
  // Contact ID - MongoDB automatically generates this
  _id: string;

  // Title - contact ka naam (e.g., "Ambulance", "Police", "Fire Brigade")
  @Prop({ required: true })
  title: string;

  // Subtitle - phone number ya description
  @Prop({ required: true })
  subtitle: string;

  // Phone number - emergency ka phone number
  @Prop({ required: true })
  phone: string;

  // Icon - icon ka naam (e.g., "ambulance", "police", "fire")
  @Prop({ required: true })
  icon: string;

  // Icon color - icon ka color (hex code)
  @Prop({ required: true })
  iconColor: string;

  // Icon background color - icon ka background color (hex code)
  @Prop({ required: true })
  iconBackgroundColor: string;

  // Created at timestamp (auto-generated)
  createdAt: Date;

  // Updated at timestamp (auto-generated)
  updatedAt: Date;
}

export const EmergencyContactSchema = SchemaFactory.createForClass(EmergencyContact);
