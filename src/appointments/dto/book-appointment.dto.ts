// Book Appointment DTO - Naye appointment book karne ke liye
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';

export class BookAppointmentDto {
  // Doctor ID - jis doctor ke saath appointment book karni hai
  @IsString()
  @IsNotEmpty({ message: 'Doctor ID zaroori hai' })
  doctorId: string;

  // Appointment ki date
  @IsString()
  @IsNotEmpty({ message: 'Date zaroori hai' })
  date: string;

  // Appointment ka time slot
  @IsString()
  @IsNotEmpty({ message: 'Time zaroori hai' })
  time: string;

  // Appointment ka type
  @IsEnum(['consultation', 'follow-up'], { message: 'Type consultation ya follow-up hona chahiye' })
  @IsNotEmpty({ message: 'Type zaroori hai' })
  type: 'consultation' | 'follow-up';

  // Patient ke notes (optional)
  @IsString()
  @IsOptional()
  patientNotes?: string;
}
