// Review Entity - Doctor reviews ke liye MongoDB schema
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review extends Document {
  // Review ID - MongoDB automatically generates this
  _id: string;

  // Patient ID - jis ne review likha
  @Prop({ required: true })
  patientId: string;

  // Patient ka naam (denormalized for quick access)
  @Prop({ required: true })
  patientName: string;

  // Doctor ID - jis doctor ke liye review hai
  @Prop({ required: true })
  doctorId: string;

  // Doctor ka naam (denormalized for quick access)
  @Prop({ required: true })
  doctorName: string;

  // Rating - 1 se 5 stars
  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  // Comment - review ka text
  @Prop({ required: true })
  comment: string;

  // Created at timestamp (auto-generated)
  createdAt: Date;

  // Updated at timestamp (auto-generated)
  updatedAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
