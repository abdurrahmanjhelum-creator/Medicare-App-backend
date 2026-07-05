// Doctor Entity - Doctor specific fields extending User
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DoctorDocument = Doctor & Document;

@Schema({ timestamps: true })
export class Doctor extends Document {
  // Doctor ID - MongoDB automatically generates this
  _id: string;

  // User reference (base user data)
  @Prop({ required: true })
  userId: string;

  // PMDC License number - unique identifier for doctor
  @Prop({ required: true, unique: true })
  pmdcLicenceNumber: string;

  // Specialization - doctor ki expertise (e.g., Cardiologist, Dermatologist)
  @Prop({ required: true })
  specialization: string;

  // Qualification - doctor ki degree (e.g., MBBS, MD)
  @Prop({ required: true })
  qualification: string;

  // Experience - years mein
  @Prop({ required: true, default: 0 })
  experience: number;

  // Clinic/Hospital ka naam
  @Prop({ required: true })
  clinic: string;

  // Clinic/Hospital address
  @Prop()
  clinicAddress?: string;

  // Consultation fee
  @Prop({ required: true, default: 0 })
  fee: number;

  // Doctor ka bio/description
  @Prop({ required: true })
  bio: string;

  // Available days - array of days (e.g., ['Monday', 'Tuesday', 'Wednesday'])
  @Prop({ required: true, type: [String] })
  availableDays: string[];

  // Available time slots - array of time slots (e.g., ['09:00-10:00', '10:00-11:00'])
  @Prop({ type: [String], default: [] })
  availableSlots?: string[];

  // Rating - average rating from patients (0-5)
  @Prop({ default: 0 })
  rating: number;

  // Total reviews count
  @Prop({ default: 0 })
  totalReviews: number;

  // Is doctor verified by admin
  @Prop({ default: false })
  isVerified: boolean;

  // Created at timestamp
  createdAt: Date;

  // Updated at timestamp
  updatedAt: Date;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
