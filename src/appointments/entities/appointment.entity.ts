// Appointment Entity - Patient appointments ke liye MongoDB schema
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment extends Document {
  // Appointment ID - MongoDB automatically generates this
  _id: string;

  // Patient ID - jis patient ki appointment hai
  @Prop({ required: true })
  patientId: string;

  // Patient ka naam (denormalized for quick access)
  @Prop({ required: true })
  patientName: string;

  // Doctor ID - jis doctor ke saath appointment hai
  @Prop({ required: true })
  doctorId: string;

  // Doctor ka naam (denormalized for quick access)
  @Prop({ required: true })
  doctorName: string;

  // Doctor ka image URL (denormalized for quick access)
  @Prop()
  doctorImage?: string;

  // Doctor ki specialization
  @Prop({ required: true })
  specialization: string;

  // Appointment ka time slot (e.g., "10:00 AM - 10:30 AM")
  @Prop({ required: true })
  time: string;

  // Appointment ki date
  @Prop({ required: true })
  date: Date;

  // Appointment ka type (consultation, follow-up)
  @Prop({ required: true, enum: ['consultation', 'follow-up'] })
  type: 'consultation' | 'follow-up';

  // Clinic/Hospital ka naam (location)
  @Prop({ required: true })
  location: string;

  // Appointment status
  @Prop({ required: true, enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rejected'], default: 'pending' })
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';

  // Patient ke notes (optional)
  @Prop()
  patientNotes?: string;

  // Doctor ke notes (optional)
  @Prop()
  doctorNotes?: string;

  // Cancellation reason (agar cancelled hai)
  @Prop()
  cancellationReason?: string;

  // Created at timestamp (auto-generated)
  createdAt: Date;

  // Updated at timestamp (auto-generated)
  updatedAt: Date;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
