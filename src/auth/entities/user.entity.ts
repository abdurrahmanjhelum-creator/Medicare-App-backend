// User Entity - Base user schema for both patients and doctors
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true }) // Automatically add createdAt and updatedAt fields
export class User extends Document {
  // User ID - MongoDB automatically generates this
  _id: string;

  // Email - unique identifier for user
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  // Password - hashed using bcrypt
  @Prop({ required: true })
  password: string;

  // Role - 'patient' or 'doctor'
  @Prop({ required: true, enum: ['patient', 'doctor'] })
  role: string;

  // Name - user ka naam
  @Prop({ required: true })
  name: string;

  // Phone number
  @Prop({ required: true })
  phone: string;

  // Profile image URL (optional)
  @Prop()
  profileImage?: string;

  // Is account active or not
  @Prop({ default: true })
  isActive: boolean;

  // OTP for password reset (optional)
  @Prop()
  otp?: string;

  // OTP expiration time
  @Prop()
  otpExpires?: Date;

  // Created at timestamp (auto-generated)
  createdAt: Date;

  // Updated at timestamp (auto-generated)
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
