// Cancel Appointment DTO - Appointment cancel karne ke liye
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CancelAppointmentDto {
  // Appointment ID - jo appointment cancel karni hai
  @IsString()
  @IsNotEmpty({ message: 'Appointment ID zaroori hai' })
  appointmentId: string;

  // Cancellation reason (optional)
  @IsString()
  @IsOptional()
  reason?: string;
}
