// Lab Report Entity - Lab reports ke liye MongoDB schema
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReportDocument = Report & Document;

@Schema({ timestamps: true })
export class Report extends Document {
  // Report ID - MongoDB automatically generates this
  _id: string;

  // Patient ID - jis patient ka report hai
  @Prop({ required: true })
  patientId: string;

  // Patient Name - denormalized for quick access
  @Prop({ required: true })
  patientName: string;

  // Title - report ka title
  @Prop({ required: true })
  title: string;

  // Category - report ka category (e.g., "Blood Test", "X-Ray", "MRI")
  @Prop({ required: true })
  category: string;

  // Date - report ki date
  @Prop({ required: true })
  date: string;

  // Doctor Name - jis doctor ne report banwaya
  @Prop({ required: true })
  doctorName: string;

  // Status - report ka status (pending, completed)
  @Prop({ required: true, default: 'pending' })
  status: string;

  // File URL - uploaded file ka URL
  @Prop({ required: true })
  fileUrl: string;

  // Notes - additional notes
  @Prop()
  notes?: string;

  // Created at timestamp (auto-generated)
  createdAt: Date;

  // Updated at timestamp (auto-generated)
  updatedAt: Date;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
