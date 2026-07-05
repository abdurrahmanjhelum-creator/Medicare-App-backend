// Medicine Entity - Medicines ke liye MongoDB schema
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MedicineDocument = Medicine & Document;

@Schema({ timestamps: true })
export class Medicine extends Document {
  // Medicine ID - MongoDB automatically generates this
  _id: string;

  // Title - medicine ka naam
  @Prop({ required: true })
  title: string;

  // Category - medicine ka category (e.g., "Antibiotics", "Painkillers")
  @Prop({ required: true })
  category: string;

  // Price - medicine ka price
  @Prop({ required: true })
  price: number;

  // Description - medicine ki details
  @Prop()
  description?: string;

  // In Stock - kya medicine available hai
  @Prop({ default: true })
  inStock: boolean;

  // Manufacturer - medicine banane wali company
  @Prop()
  manufacturer?: string;

  // Image URL - medicine ki image
  @Prop()
  imageUrl?: string;

  // Dosage - dosage information
  @Prop()
  dosage?: string;

  // Side Effects - side effects information
  @Prop()
  sideEffects?: string;

  // Created at timestamp (auto-generated)
  createdAt: Date;

  // Updated at timestamp (auto-generated)
  updatedAt: Date;
}

export const MedicineSchema = SchemaFactory.createForClass(Medicine);
