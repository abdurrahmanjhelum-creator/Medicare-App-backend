// Patient Entity - Patient specific fields extending User
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PatientDocument = Patient & Document;

@Schema({ timestamps: true })
export class Patient extends Document {
  // Patient ID - MongoDB automatically generates this
  _id: string;

  // User reference (base user data)
  @Prop({ required: true })
  userId: string;

  // CNIC number - 13 digits
  @Prop({ required: true, unique: true })
  cnic: string;

  // Date of birth
  @Prop({ required: true })
  dob: Date;

  // Father's name
  @Prop({ required: true })
  fatherName: string;

  // Age
  @Prop({ required: true })
  age: number;

  // Blood group (optional)
  @Prop()
  bloodGroup?: string;

  // Medical history (optional) - array of previous conditions
  @Prop({ type: [String], default: [] })
  medicalHistory?: string[];

  // Allergies (optional) - array of allergies
  @Prop({ type: [String], default: [] })
  allergies?: string[];

  // Emergency contact name
  @Prop()
  emergencyContactName?: string;

  // Emergency contact phone
  @Prop()
  emergencyContactPhone?: string;

  // Address
  @Prop()
  address?: string;

  // Created at timestamp
  createdAt: Date;

  // Updated at timestamp
  updatedAt: Date;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
