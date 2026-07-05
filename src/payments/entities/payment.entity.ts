// Payment Entity - Payments ke liye MongoDB schema
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment extends Document {
  // Payment ID - MongoDB automatically generates this
  _id: string;

  // User ID - jis user ne payment ki
  @Prop({ required: true })
  userId: string;

  // User name - denormalized for quick access
  @Prop({ required: true })
  userName: string;

  // Appointment ID - jis appointment ke liye payment hai
  @Prop({ required: true })
  appointmentId: string;

  // Amount - payment ka amount
  @Prop({ required: true })
  amount: number;

  // Currency - currency ka code (default: PKR)
  @Prop({ default: 'PKR' })
  currency: string;

  // Stripe Payment Intent ID - Stripe payment ka ID
  @Prop()
  stripePaymentIntentId?: string;

  // Status - payment ka status (pending, completed, failed, refunded)
  @Prop({ required: true, default: 'pending' })
  status: string;

  // Payment method - payment ka method (card, cash, etc.)
  @Prop({ required: true })
  paymentMethod: string;

  // Transaction ID - transaction ka ID
  @Prop()
  transactionId?: string;

  // Failure reason - agar payment fail ho gaya
  @Prop()
  failureReason?: string;

  // Created at timestamp (auto-generated)
  createdAt: Date;

  // Updated at timestamp (auto-generated)
  updatedAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
